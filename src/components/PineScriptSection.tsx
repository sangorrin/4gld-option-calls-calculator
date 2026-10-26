import React, { useState } from 'react';
import { Code, Copy, Check, Terminal, Layers, Info } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface PineScriptSectionProps {
  language: Language;
}

export const PineScriptSection: React.FC<PineScriptSectionProps> = ({ language }) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);

  const pineScriptCode = `//@version=5
indicator("4GLD Covered Call Assistant", overlay=true, max_lines_count=100, max_labels_count=50)

// --- Inputs ---
smaFastLen   = input.int(20, "Fast SMA (Trend)", group="Moving Averages")
smaSlowLen   = input.int(50, "Slow SMA (Trend)", group="Moving Averages")
pivotLeft    = input.int(10, "Pivot High Left Bars", group="Resistances")
pivotRight   = input.int(10, "Pivot High Right Bars", group="Resistances")
volPeriod    = input.int(30, "Historical Volatility Period (Days)", group="Quantitative Model")
targetDTE    = input.int(35, "Quant Model Target DTE", group="Quantitative Model")

// --- 1. Moving Averages & Trend ---
smaFast = ta.sma(close, smaFastLen)
smaSlow = ta.sma(close, smaSlowLen)

plot(smaFast, color=color.new(#fbc02d, 0), title="SMA Fast (20)", linewidth=2)
plot(smaSlow, color=color.new(#1976d2, 0), title="SMA Slow (50)", linewidth=2)

isBullish = (close > smaFast) and (smaFast > smaSlow)
isBearish = (close < smaFast) and (smaFast < smaSlow)
trendStr  = isBullish ? "BULLISH" : isBearish ? "BEARISH" : "SIDEWAYS"
trendCol  = isBullish ? color.new(#2e7d32, 0) : isBearish ? color.new(#c62828, 0) : color.new(#f57f17, 0)

// --- 2. Resistances (Pivot Highs) ---
pHigh = ta.pivothigh(high, pivotLeft, pivotRight)

var float[] rawPivots = array.new_float(0)
if not na(pHigh)
    array.unshift(rawPivots, pHigh)
    if array.size(rawPivots) > 30
        array.pop(rawPivots)

// Extract distinct resistance levels above the current price
float r1 = na
float r2 = na

if array.size(rawPivots) > 0
    float[] candidates = array.new_float(0)
    for i = 0 to array.size(rawPivots) - 1
        float p = array.get(rawPivots, i)
        if p > close
            array.push(candidates, p)
    
    if array.size(candidates) > 0
        array.sort(candidates, order.ascending)
        r1 := array.get(candidates, 0)
        for j = 0 to array.size(candidates) - 1
            float cand = array.get(candidates, j)
            if cand > r1 * 1.01
                r2 := cand
                break

r1 := na(r1) ? close * 1.03 : r1
r2 := na(r2) ? (r1 * 1.03) : r2

// Draw dynamic resistance lines extending forward
var line lineR1 = na
var line lineR2 = na
line.delete(lineR1)
line.delete(lineR2)

if barstate.islast
    lineR1 := line.new(bar_index - 20, r1, bar_index + 20, r1, color=color.orange, width=2, style=line.style_dashed)
    lineR2 := line.new(bar_index - 20, r2, bar_index + 20, r2, color=color.red, width=2, style=line.style_dashed)

// --- 3. Quantitative 1-Sigma Strike (~0.16 Delta) ---
logRet = math.log(close / close[1])
dailyStdDev = ta.stdev(logRet, volPeriod)
annVol = dailyStdDev * math.sqrt(252)

// Expected upper move over target DTE: Price * Vol * sqrt(t)
expectedUpperMove = close * annVol * math.sqrt(targetDTE / 365.0)
quantStrike = close + expectedUpperMove

var line lineQuant = na
line.delete(lineQuant)
if barstate.islast
    lineQuant := line.new(bar_index - 20, quantStrike, bar_index + 20, quantStrike, color=color.fuchsia, width=2, style=line.style_dotted)

// --- 4. Strategy Recommendations ---
cavaDTE    = isBullish ? "15 DTE" : "30 DTE"
cavaStrike = isBullish ? math.max(r2, close * 1.04) : r2

// --- 5. Info Table Dashboard ---
var table dash = table.new(position.top_right, 2, 7, bgcolor=color.new(#181a20, 10), border_color=color.gray, border_width=1)

if barstate.islast
    // Header
    table.cell(dash, 0, 0, "4GLD Covered Call Assistant", bgcolor=color.new(#262b33, 0), text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 0, "Execution Target", bgcolor=color.new(#262b33, 0), text_color=color.white, text_size=size.small)

    // Current Price & Volatility
    table.cell(dash, 0, 1, "Spot Price | Volatility", text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 1, "€" + str.tostring(close, "#.##") + " | " + str.tostring(annVol * 100, "#.#") + "%", text_color=color.white, text_size=size.small)

    // Regime
    table.cell(dash, 0, 2, "Trend / Regime", text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 2, trendStr, bgcolor=trendCol, text_color=color.white, text_size=size.small)

    // Resistances
    table.cell(dash, 0, 3, "Resistances (R1 / R2)", text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 3, "€" + str.tostring(r1, "#.##") + " / €" + str.tostring(r2, "#.##"), text_color=color.orange, text_size=size.small)

    // Cava Model
    table.cell(dash, 0, 4, "Cava Strategy Target", text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 4, cavaDTE + " | Strike ≥ €" + str.tostring(cavaStrike, "#.##"), text_color=#ffd54f, text_size=size.small)

    // Quant Model
    table.cell(dash, 0, 5, "Quant 0.16Δ Target", text_color=color.white, text_size=size.small)
    table.cell(dash, 1, 5, str.tostring(targetDTE) + " DTE | Strike ≥ €" + str.tostring(quantStrike, "#.##"), text_color=color.fuchsia, text_size=size.small)

    // Action rule
    table.cell(dash, 0, 6, "Execution Rule", text_color=color.gray, text_size=size.tiny)
    table.cell(dash, 1, 6, "1 Call per 100 shares. Exit at 50% max profit.", text_color=color.gray, text_size=size.tiny)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pineScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 mb-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400 mt-0.5 flex-shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              {t.pineTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{t.pineSubtitle}</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm transition-colors flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-slate-950" />
              <span>{t.pineCopiedBtn}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{t.pineCopyBtn}</span>
            </>
          )}
        </button>
      </div>

      {/* Two Columns: Installation Steps & Chart Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
        {/* Step-by-Step Instructions */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Code className="w-4 h-4" />
            <span>{t.pineInstallTitle}</span>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 leading-relaxed">
            <li>{t.pineStep1}</li>
            <li>{t.pineStep2}</li>
            <li>{t.pineStep3}</li>
            <li>{t.pineStep4}</li>
            <li>{t.pineStep5}</li>
            <li>{t.pineStep6}</li>
          </ol>
        </div>

        {/* What You Will See on Your Chart */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4" />
            <span>{t.pineChartLegendTitle}</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold mt-0.5">⚬</span>
              <span>
                <strong className="text-yellow-300">
                  {language === 'es' ? 'Curvas Amarilla y Azul:' : 'Yellow & Blue Curves:'}
                </strong>{' '}
                {language === 'es'
                  ? 'Las Medias Móviles Simples (SMA) diarias de 20 y 50 periodos.'
                  : 'The 20 and 50 daily Simple Moving Averages.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-400 font-bold mt-0.5">⚬</span>
              <span>
                <strong className="text-orange-400">
                  {language === 'es' ? 'Líneas Discontinuas Naranja y Roja:' : 'Orange & Red Dashed Lines:'}
                </strong>{' '}
                {language === 'es'
                  ? 'Los niveles de resistencia actuales (R1 y R2) calculados a partir de los máximos pivot.'
                  : 'The current resistance levels (R1 and R2) derived from pivot swing highs.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold mt-0.5">⚬</span>
              <span>
                <strong className="text-fuchsia-400">
                  {language === 'es' ? 'Línea de Puntos Fucsia:' : 'Dotted Purple Line:'}
                </strong>{' '}
                {language === 'es'
                  ? 'El techo estadístico de volatilidad a 0.16 Delta proyectado a 35 días.'
                  : 'The statistical 0.16 Delta volatility ceiling projected over 35 days.'}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold mt-0.5">⚬</span>
              <span>
                <strong className="text-slate-200">
                  {language === 'es' ? 'Tabla Panel de Control (Arriba Derecha):' : 'Dashboard Table (Top Right):'}
                </strong>{' '}
                {language === 'es'
                  ? 'Muestra el régimen de mercado (Alcista/Lateral/Bajista), spot, volatilidad y strikes recomendados.'
                  : 'Displays the market regime (Bullish/Sideways/Bearish), spot price, volatility, and exact recommended strike floors and DTE.'}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="border border-slate-800 rounded-xl bg-slate-950 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
            <span>4GLD_Covered_Call_Assistant.pine</span>
          </div>
          <span className="text-[11px] text-slate-500">TradingView Pine Script v5</span>
        </div>
        <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed select-all max-h-96">
          {pineScriptCode}
        </pre>
      </div>
    </section>
  );
};
