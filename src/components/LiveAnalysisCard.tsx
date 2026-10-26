import React, { useState } from 'react';
import { RecommendationResult } from '../types';
import { Language, translations } from '../i18n/translations';
import {
  TrendingUp,
  Activity,
  Shield,
  Copy,
  Check,
  Clock,
  Coins,
  Percent,
  Sliders,
  ExternalLink,
} from 'lucide-react';

interface LiveAnalysisCardProps {
  cavaRec: RecommendationResult;
  quantRec: RecommendationResult;
  language: Language;
}

export const LiveAnalysisCard: React.FC<LiveAnalysisCardProps> = ({
  cavaRec,
  quantRec,
  language,
}) => {
  const t = translations[language];
  const [copiedModel, setCopiedModel] = useState<'cava' | 'quant' | null>(null);
  const [simulatedExpiryPrice, setSimulatedExpiryPrice] = useState<number>(cavaRec.spotPrice);

  React.useEffect(() => {
    setSimulatedExpiryPrice(cavaRec.spotPrice);
  }, [cavaRec.spotPrice]);

  const copyInstructions = (model: 'cava' | 'quant') => {
    const rec = model === 'cava' ? cavaRec : quantRec;
    const modelLabel = model === 'cava' ? 'Cava Model' : 'Quantitative Delta Model';

    const text = `Freedom24 4GLD Covered Call Execution (${modelLabel}):
Ticker: 4GLD (ISIN: DE000A0S9GB0, Xetra-Gold)
Action: Sell to Open 1 Call Contract (100 shares required)
Target Expiration: ~${rec.recommendedExpiryDate} (${rec.recommendedDTE} DTE)
Recommended Strike: ≥ €${rec.recommendedStrike.toFixed(2)}
Estimated Cash Premium: ~€${rec.estimatedTotalCash.toFixed(2)}
Order Type: Limit Order (at midpoint of Bid/Ask)`;

    navigator.clipboard.writeText(text);
    setCopiedModel(model);
    setTimeout(() => setCopiedModel(null), 2500);
  };

  const trafficLight = cavaRec.trafficLight;
  const initialSpot = cavaRec.spotPrice;

  // Simulator based on average or primary strike
  const strikeToSimulate = cavaRec.recommendedStrike;
  const premiumToSimulate = cavaRec.estimatedTotalCash;
  const isAssigned = simulatedExpiryPrice >= strikeToSimulate;
  const simEffectiveSoldPrice = isAssigned ? strikeToSimulate : simulatedExpiryPrice;
  const simCapitalGain = (simEffectiveSoldPrice - initialSpot) * 100;
  const simTotalPnL = premiumToSimulate + simCapitalGain;
  const simReturnPct = (simTotalPnL / (initialSpot * 100)) * 100;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
      {/* Title & Spot Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400">
              <Shield className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-white">{t.liveDashboardTitle}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{t.liveDashboardSubtitle}</p>
        </div>

        {/* Current Spot Summary Tag */}
        <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
              {t.currentSpot}
            </span>
            <div className="text-lg font-bold text-white font-mono">
              €{initialSpot.toFixed(2)}
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div className="text-[11px] text-slate-400">
            <div>SMA20: <span className="text-slate-200 font-mono">€{cavaRec.sma20.toFixed(2)}</span></div>
            <div>SMA50: <span className="text-slate-200 font-mono">€{cavaRec.sma50.toFixed(2)}</span></div>
          </div>
        </div>
      </div>

      {/* Traffic Light Banner */}
      <div
        className={`rounded-xl p-4 mb-5 border transition-all ${
          trafficLight.status === 'green'
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
            : trafficLight.status === 'yellow'
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-100'
            : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 animate-pulse ${
              trafficLight.status === 'green'
                ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                : trafficLight.status === 'yellow'
                ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
            }`}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-sm tracking-wide">
                {trafficLight.status === 'green'
                  ? t.trafficGreenTitle
                  : trafficLight.status === 'yellow'
                  ? t.trafficYellowTitle
                  : t.trafficRedTitle}
              </span>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <span>RSI(14): <strong>{trafficLight.rsi}</strong></span>
                <span>·</span>
                <span>Vol: <strong>{trafficLight.volatilityRank}</strong></span>
                <span>·</span>
                <span>
                  vs SMA20:{' '}
                  <strong>
                    {trafficLight.priceVsSma20Pct > 0
                      ? `+${trafficLight.priceVsSma20Pct}`
                      : trafficLight.priceVsSma20Pct}%
                  </strong>
                </span>
              </div>
            </div>
            <p className="text-xs mt-1.5 leading-relaxed opacity-90">
              {trafficLight.status === 'green'
                ? t.trafficGreenDesc
                : trafficLight.status === 'yellow'
                ? t.trafficYellowDesc
                : t.trafficRedDesc}
            </p>
          </div>
        </div>
      </div>

      {/* BOTH STRATEGIES ALWAYS DISPLAYED SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Model 1: José Luis Cava Model */}
        <div className="bg-slate-950/80 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                {t.cavaModelName}
              </span>
              <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/15 px-2 py-0.5 rounded">
                {cavaRec.regime}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">{t.cavaModelSubtitle}</p>

            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {t.targetStrike}
                </span>
                <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
                  €{cavaRec.recommendedStrike.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-500">
                  +{cavaRec.strikeBufferPct}% {t.strikeBuffer}
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {t.targetExpiry}
                </span>
                <div className="text-xl font-bold text-cyan-300 font-mono mt-0.5">
                  {cavaRec.recommendedDTE} {t.daysToExpiry}
                </div>
                <span className="text-[10px] text-slate-500">
                  ~{cavaRec.recommendedExpiryDate}
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {t.cashPremium}
                </span>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                  €{cavaRec.estimatedTotalCash.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-500">
                  €{cavaRec.estimatedPremiumPerShare.toFixed(2)} / {language === 'es' ? 'acción' : 'share'}
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {t.annualizedYield}
                </span>
                <div className="text-xl font-bold text-emerald-300 font-mono mt-0.5">
                  {cavaRec.annualizedYieldPct}%
                </div>
                <span className="text-[10px] text-slate-500">
                  {t.probOtm}: {cavaRec.winProbabilityPct}%
                </span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 space-y-1 mb-3">
              {cavaRec.reasoning.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-400">•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => copyInstructions('cava')}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors"
          >
            {copiedModel === 'cava' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.copiedInstructions}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copyInstructions} (Cava)</span>
              </>
            )}
          </button>
        </div>

        {/* Model 2: Quantitative Delta Model */}
        <div className="bg-slate-950/80 border border-blue-500/40 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-400" />
                {t.quantModelName}
              </span>
              <span className="text-[10px] text-blue-300 font-semibold bg-blue-500/15 px-2 py-0.5 rounded">
                ~0.16 Delta
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">{t.quantModelSubtitle}</p>

            <div className="grid grid-cols-2 gap-2.5 mb-3">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {t.targetStrike}
                </span>
                <div className="text-xl font-bold text-blue-400 font-mono mt-0.5">
                  €{quantRec.recommendedStrike.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-500">
                  +{quantRec.strikeBufferPct}% {t.strikeBuffer}
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {t.targetExpiry}
                </span>
                <div className="text-xl font-bold text-cyan-300 font-mono mt-0.5">
                  {quantRec.recommendedDTE} {t.daysToExpiry}
                </div>
                <span className="text-[10px] text-slate-500">
                  ~{quantRec.recommendedExpiryDate}
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {t.cashPremium}
                </span>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                  €{quantRec.estimatedTotalCash.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-500">
                  €{quantRec.estimatedPremiumPerShare.toFixed(2)} / {language === 'es' ? 'acción' : 'share'}
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  {t.annualizedYield}
                </span>
                <div className="text-xl font-bold text-emerald-300 font-mono mt-0.5">
                  {quantRec.annualizedYieldPct}%
                </div>
                <span className="text-[10px] text-slate-500">
                  {t.probOtm}: <strong className="text-emerald-400">{quantRec.winProbabilityPct}%</strong>
                </span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 space-y-1 mb-3">
              {quantRec.reasoning.map((r, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-blue-400">•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => copyInstructions('quant')}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 transition-colors"
          >
            {copiedModel === 'quant' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.copiedInstructions}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copyInstructions} (Quant Delta)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Freedom24 4-Step Visual Guide */}
      <div className="bg-indigo-950/30 border border-indigo-500/40 rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              {t.freedomTitle}
            </h3>
          </div>
          <span className="text-[11px] text-indigo-300/80 font-mono">ISIN: DE000A0S9GB0</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-slate-900/90 border border-indigo-900/50 p-2.5 rounded-lg">
            <span className="text-[10px] text-indigo-400 block font-semibold mb-0.5">
              {t.freedomStep1Title}
            </span>
            <div className="text-slate-200 font-medium">100 4GLD {language === 'es' ? 'Acciones' : 'Shares'}</div>
            <div className="text-[11px] text-slate-400 mt-1">{t.freedomStep1Desc}</div>
          </div>

          <div className="bg-slate-900/90 border border-indigo-900/50 p-2.5 rounded-lg">
            <span className="text-[10px] text-indigo-400 block font-semibold mb-0.5">
              {t.freedomStep2Title}
            </span>
            <div className="text-slate-200 font-medium">{language === 'es' ? 'Buscar 4GLD Opciones' : 'Search 4GLD Options'}</div>
            <div className="text-[11px] text-slate-400 mt-1">{t.freedomStep2Desc}</div>
          </div>

          <div className="bg-slate-900/90 border border-indigo-900/50 p-2.5 rounded-lg">
            <span className="text-[10px] text-indigo-400 block font-semibold mb-0.5">
              {t.freedomStep3Title}
            </span>
            <div className="text-slate-200 font-medium">Call &ge; €{cavaRec.recommendedStrike.toFixed(2)}</div>
            <div className="text-[11px] text-slate-400 mt-1">{t.freedomStep3Desc}</div>
          </div>

          <div className="bg-slate-900/90 border border-indigo-900/50 p-2.5 rounded-lg">
            <span className="text-[10px] text-indigo-400 block font-semibold mb-0.5">
              {t.freedomStep4Title}
            </span>
            <div className="text-emerald-400 font-medium">{language === 'es' ? 'Vender 1 Contrato' : 'Sell to Open 1 Cont.'}</div>
            <div className="text-[11px] text-slate-400 mt-1">{t.freedomStep4Desc}</div>
          </div>
        </div>
      </div>

      {/* Interactive What-If Scenario Simulator */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-semibold text-slate-200">{t.simulatorTitle}</h4>
          </div>
          <span className="text-xs text-slate-400">{t.simulatorSubtitle}</span>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>
                {t.simulatedPrice}:{' '}
                <strong className="text-amber-400 font-mono text-sm">
                  €{simulatedExpiryPrice.toFixed(2)}
                </strong>
              </span>
              <span className="text-slate-400">
                {simulatedExpiryPrice >= strikeToSimulate ? (
                  <span className="text-amber-400 font-medium">
                    {language === 'es'
                      ? `Por encima de €${strikeToSimulate.toFixed(2)} → Acciones Vendidas con Ganancia`
                      : `Above €${strikeToSimulate.toFixed(2)} → Shares Sold with Profit`}
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium">
                    {language === 'es'
                      ? `Por debajo de €${strikeToSimulate.toFixed(2)} → 100% Acciones Conservadas`
                      : `Below €${strikeToSimulate.toFixed(2)} → 100% Shares Retained`}
                  </span>
                )}
              </span>
            </div>
            <input
              type="range"
              min={Number((initialSpot * 0.85).toFixed(1))}
              max={Number((initialSpot * 1.15).toFixed(1))}
              step="0.5"
              value={simulatedExpiryPrice}
              onChange={(e) => setSimulatedExpiryPrice(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>-15% (€{(initialSpot * 0.85).toFixed(1)})</span>
              <span>Spot: €{initialSpot.toFixed(2)}</span>
              <span>Strike: €{strikeToSimulate.toFixed(2)}</span>
              <span>+15% (€{(initialSpot * 1.15).toFixed(1)})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">{t.premiumKept}</span>
              <span className="text-emerald-400 font-bold text-sm">+€{premiumToSimulate.toFixed(2)}</span>
              <span className="text-[10px] text-slate-500 block">
                {language === 'es' ? 'Efectivo no reembolsable en cuenta' : 'Non-refundable rent check'}
              </span>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">{t.goldChange}</span>
              <span
                className={`font-bold text-sm ${
                  simCapitalGain >= 0 ? 'text-slate-200' : 'text-rose-400'
                }`}
              >
                {simCapitalGain >= 0
                  ? `+€${simCapitalGain.toFixed(2)}`
                  : `-€${Math.abs(simCapitalGain).toFixed(2)}`}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {isAssigned
                  ? language === 'es' ? 'Limitado en el strike' : 'Capped at strike'
                  : language === 'es' ? 'Oro sigue en tu propiedad' : 'Gold still held'}
              </span>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">{t.netReturn}</span>
              <span
                className={`font-bold text-sm ${
                  simTotalPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {simTotalPnL >= 0
                  ? `+€${simTotalPnL.toFixed(2)}`
                  : `-€${Math.abs(simTotalPnL).toFixed(2)}`}{' '}
                ({simReturnPct.toFixed(1)}%)
              </span>
              <span className="text-[10px] text-slate-500 block">
                {simTotalPnL >= 0
                  ? language === 'es' ? 'Rendimiento positivo neto' : 'Net positive income'
                  : language === 'es' ? 'La prima amortiguó la bajada' : 'Premium buffered drop'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
