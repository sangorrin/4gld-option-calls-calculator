import React, { useState, useMemo } from 'react';
import { Candle, BacktestOutcome } from '../types';
import { runBacktest } from '../utils/indicators';
import { Language, translations } from '../i18n/translations';
import {
  FlaskConical,
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

interface BacktestCardProps {
  candles: Candle[];
  language: Language;
}

export const BacktestCard: React.FC<BacktestCardProps> = ({ candles, language }) => {
  const t = translations[language];

  // Selectable backtest dates
  const availableDates = useMemo(() => {
    if (candles.length < 35) return [];
    const dates: { date: string; close: number }[] = [];
    for (let i = 25; i < candles.length - 10; i += 2) {
      dates.push({
        date: candles[i].datetime,
        close: candles[i].close,
      });
    }
    return dates;
  }, [candles]);

  const [selectedDate, setSelectedDate] = useState<string>(
    availableDates.length > 5 ? availableDates[Math.floor(availableDates.length / 2)].date : ''
  );

  // Compute outcomes for BOTH algorithms simultaneously
  const cavaOutcome: BacktestOutcome | null = useMemo(() => {
    if (!selectedDate || candles.length < 30) return null;
    try {
      return runBacktest(candles, selectedDate, 'cava');
    } catch (e) {
      console.error('Cava backtest error:', e);
      return null;
    }
  }, [candles, selectedDate]);

  const quantOutcome: BacktestOutcome | null = useMemo(() => {
    if (!selectedDate || candles.length < 30) return null;
    try {
      return runBacktest(candles, selectedDate, 'quant_delta');
    } catch (e) {
      console.error('Quant Delta backtest error:', e);
      return null;
    }
  }, [candles, selectedDate]);

  // SVG Trajectory calculations displaying BOTH strikes overlaid
  const chartData = useMemo(() => {
    const primary = cavaOutcome || quantOutcome;
    if (!primary || !primary.pathCandles || primary.pathCandles.length === 0) return null;

    const path = primary.pathCandles;
    const strikes = [
      cavaOutcome?.recommendedStrike ?? primary.recommendedStrike,
      quantOutcome?.recommendedStrike ?? primary.recommendedStrike,
      primary.initialSpot,
    ];

    const allPrices = [
      ...path.map((c) => c.close),
      ...path.map((c) => c.high),
      ...path.map((c) => c.low),
      ...strikes,
    ];

    const minPrice = Math.min(...allPrices) * 0.985;
    const maxPrice = Math.max(...allPrices) * 1.015;
    const priceRange = maxPrice - minPrice || 1;

    const width = 680;
    const height = 190;
    const padding = { top: 20, right: 40, bottom: 25, left: 45 };

    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const getX = (index: number) =>
      padding.left + (index / Math.max(1, path.length - 1)) * innerWidth;
    const getY = (price: number) =>
      padding.top + innerHeight - ((price - minPrice) / priceRange) * innerHeight;

    const points = path.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' ');
    const cavaStrikeY = cavaOutcome ? getY(cavaOutcome.recommendedStrike) : null;
    const quantStrikeY = quantOutcome ? getY(quantOutcome.recommendedStrike) : null;
    const entryY = getY(primary.initialSpot);

    return {
      width,
      height,
      padding,
      points,
      cavaStrikeY,
      quantStrikeY,
      entryY,
      path,
      getX,
      getY,
    };
  }, [cavaOutcome, quantOutcome]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-500/20 text-blue-400">
              <FlaskConical className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">{t.backtestTitle}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{t.backtestSubtitle}</p>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 mb-5">
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.choosePastDate}</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-500 font-mono"
          >
            {availableDates.map((item) => (
              <option key={item.date} value={item.date}>
                {item.date} — Gold Spot: €{item.close.toFixed(2)}
              </option>
            ))}
          </select>

          <div className="text-xs text-slate-400">
            {cavaOutcome && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-500">{t.testDate}:</span>
                <strong className="text-slate-200">{cavaOutcome.testDate}</strong>
                <ArrowRight className="w-3 h-3 text-slate-600" />
                <span className="text-slate-500">Spot:</span>
                <strong className="text-white">€{cavaOutcome.initialSpot.toFixed(2)}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOTH ALGORITHMS EVALUATED SIMULTANEOUSLY */}
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        {t.bothModelsCompared}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Cava Outcome Card */}
        {cavaOutcome && (
          <div
            className={`border rounded-xl p-4 flex flex-col justify-between ${
              cavaOutcome.outcomeType === 'EXPIRED_WORTHLESS'
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-amber-950/30 border-amber-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  {t.cavaModelName}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900/80 border border-current">
                  P&L: +€{cavaOutcome.totalPnLEuro.toFixed(2)}
                </span>
              </div>

              <div className="flex items-start gap-2.5 my-2">
                {cavaOutcome.outcomeType === 'EXPIRED_WORTHLESS' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-white">{cavaOutcome.headline}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {cavaOutcome.investorStory}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] pt-3 mt-2 border-t border-slate-800/80">
              <div className="bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400 block text-[10px]">{t.targetStrike}</span>
                <span className="font-bold text-amber-400">€{cavaOutcome.recommendedStrike.toFixed(2)}</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400 block text-[10px]">{t.cashPremium}</span>
                <span className="font-bold text-emerald-400">+€{cavaOutcome.estimatedPremiumCollected.toFixed(2)}</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400 block text-[10px]">{t.finalSpot}</span>
                <span className="font-bold text-slate-200">€{cavaOutcome.finalSpotAtExpiry.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quant Delta Outcome Card */}
        {quantOutcome && (
          <div
            className={`border rounded-xl p-4 flex flex-col justify-between ${
              quantOutcome.outcomeType === 'EXPIRED_WORTHLESS'
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : 'bg-amber-950/30 border-amber-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4" />
                  {t.quantModelName}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900/80 border border-current">
                  P&L: +€{quantOutcome.totalPnLEuro.toFixed(2)}
                </span>
              </div>

              <div className="flex items-start gap-2.5 my-2">
                {quantOutcome.outcomeType === 'EXPIRED_WORTHLESS' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-white">{quantOutcome.headline}</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    {quantOutcome.investorStory}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[11px] pt-3 mt-2 border-t border-slate-800/80">
              <div className="bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400 block text-[10px]">{t.targetStrike}</span>
                <span className="font-bold text-blue-400">€{quantOutcome.recommendedStrike.toFixed(2)}</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400 block text-[10px]">{t.cashPremium}</span>
                <span className="font-bold text-emerald-400">+€{quantOutcome.estimatedPremiumCollected.toFixed(2)}</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded">
                <span className="text-slate-400 block text-[10px]">{t.finalSpot}</span>
                <span className="font-bold text-slate-200">€{quantOutcome.finalSpotAtExpiry.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlaid Price Trajectory Chart */}
      {chartData && cavaOutcome && quantOutcome && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.subsequentPath}</span>
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-3 h-0.5 bg-amber-400 inline-block border-dashed"></span>
                <span>{t.chartLegendCava}: €{cavaOutcome.recommendedStrike.toFixed(1)}</span>
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-3 h-0.5 bg-blue-400 inline-block border-dashed"></span>
                <span>{t.chartLegendQuant}: €{quantOutcome.recommendedStrike.toFixed(1)}</span>
              </span>
              <span className="flex items-center gap-1 text-sky-300">
                <span className="w-3 h-0.5 bg-sky-400 inline-block"></span>
                <span>{t.chartLegendPath}</span>
              </span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${chartData.width} ${chartData.height}`} className="w-full h-auto max-h-48">
              {/* Boundary lines */}
              <line
                x1={chartData.padding.left}
                y1={chartData.padding.top}
                x2={chartData.width - chartData.padding.right}
                y2={chartData.padding.top}
                stroke="#1e293b"
                strokeWidth="1"
              />
              <line
                x1={chartData.padding.left}
                y1={chartData.height - chartData.padding.bottom}
                x2={chartData.width - chartData.padding.right}
                y2={chartData.height - chartData.padding.bottom}
                stroke="#1e293b"
                strokeWidth="1"
              />

              {/* Cava strike line */}
              {chartData.cavaStrikeY !== null && (
                <line
                  x1={chartData.padding.left}
                  y1={chartData.cavaStrikeY}
                  x2={chartData.width - chartData.padding.right}
                  y2={chartData.cavaStrikeY}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              )}

              {/* Quant Delta strike line */}
              {chartData.quantStrikeY !== null && (
                <line
                  x1={chartData.padding.left}
                  y1={chartData.quantStrikeY}
                  x2={chartData.width - chartData.padding.right}
                  y2={chartData.quantStrikeY}
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              )}

              {/* Entry Spot Line */}
              <line
                x1={chartData.padding.left}
                y1={chartData.entryY}
                x2={chartData.width - chartData.padding.right}
                y2={chartData.entryY}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <text
                x={chartData.padding.left - 4}
                y={chartData.entryY + 3}
                fill="#94a3b8"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="end"
              >
                €{cavaOutcome.initialSpot.toFixed(1)}
              </text>

              {/* Gold price trajectory line */}
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartData.points}
              />

              {/* Key points */}
              {chartData.path.map((c, i) => {
                const x = chartData.getX(i);
                const y = chartData.getY(c.close);
                const isLast = i === chartData.path.length - 1;
                const isFirst = i === 0;

                if (isFirst || isLast) {
                  return (
                    <g key={i}>
                      <circle
                        cx={x}
                        cy={y}
                        r={isLast ? 4 : 3.5}
                        fill={isLast ? (cavaOutcome.isAssigned ? '#f59e0b' : '#10b981') : '#38bdf8'}
                        stroke="#0f172a"
                        strokeWidth="1.5"
                      />
                      <text
                        x={x}
                        y={chartData.height - 8}
                        fill="#94a3b8"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor={isFirst ? 'start' : 'end'}
                      >
                        {c.datetime}
                      </text>
                    </g>
                  );
                }
                return null;
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
