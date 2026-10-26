import React from 'react';
import { TrendingUp, Activity, Compass, Target, CheckCircle2 } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface AlgorithmExplainerProps {
  language: Language;
}

export const AlgorithmExplainer: React.FC<AlgorithmExplainerProps> = ({ language }) => {
  const t = translations[language];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-semibold text-white">{t.algoExplainerTitle}</h2>
        </div>
        <span className="text-xs text-slate-400">{t.algoExplainerSubtitle}</span>
      </div>

      {/* Always render BOTH algorithms side-by-side with no toggle buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model 1: José Luis Cava */}
        <div className="bg-slate-950/60 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                {language === 'es' ? 'Algoritmo 1' : 'Algorithm 1'}
              </span>
              <span className="text-xs text-slate-400">
                {language === 'es' ? 'Técnico / Seguidor de Tendencia' : 'Technical / Trend-Following'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-2">{t.cavaModelName}</h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              {language === 'es'
                ? 'Nombrado en honor al reconocido analista de mercados José Luis Cava, este modelo clasifica la tendencia mediante la alineación de medias móviles (SMA 20 y SMA 50) y los máximos decrecientes/crecientes previos (resistencias R1 y R2).'
                : 'Named after the renowned market analyst José Luis Cava, this model dynamically respects market regimes using moving average alignment (SMA 20 and SMA 50) and recent structural swing-high resistance peaks (R1 and R2).'}
            </p>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <strong className="text-amber-300 block mb-0.5">
                  {language === 'es'
                    ? '🐂 En Régimen Alcista (Precio > SMA20 > SMA50):'
                    : '🐂 In Bullish Regimes (Price > SMA20 > SMA50):'}
                </strong>
                {language === 'es'
                  ? 'El oro tiene fuerte impulso alcista. Para evitar que te quiten el oro en plena subida, selecciona vencimientos cortos (15 DTE) y fija el strike por encima de la resistencia clave R1. Maximiza la tasa anualizada sin perder tus acciones antes de tiempo.'
                  : 'Gold has upward momentum. To avoid losing your gold during a rally, the algorithm chooses short duration (15 DTE) and sets the strike safely above key swing-high resistance R1. You harvest high annualized velocity without getting assigned prematurely.'}
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <strong className="text-slate-300 block mb-0.5">
                  {language === 'es'
                    ? '⚖️ En Régimen Lateral / Rango:'
                    : '⚖️ In Sideways / Rangebound Regimes:'}
                </strong>
                {language === 'es'
                  ? 'Apunta a 30 DTE para capturar la aceleración del paso del tiempo (Theta). El strike se sitúa de forma conservadora por encima de la resistencia secundaria R2, asegurando que las oscilaciones normales no alcancen tu precio.'
                  : 'Targets 30 DTE to capture optimal time decay (Theta). The strike is anchored safely above major secondary resistance R2, ensuring that range oscillations do not breach your strike.'}
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <strong className="text-red-300 block mb-0.5">
                  {language === 'es' ? '🐻 En Correcciones Bajistas:' : '🐻 In Bearish Pullbacks:'}
                </strong>
                {language === 'es'
                  ? 'Fija el strike por encima de la barrera de la SMA 50 y activa el Semáforo Rojo si hay sobreventa extrema para evitar malvender en el suelo.'
                  : 'Anchors strike above the 50-day moving average barrier, and triggers the Red Traffic Light if oversold to prevent selling at the bottom.'}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>
              {language === 'es'
                ? 'Ideal para inversores que siguen la acción del precio y estructuras de mercado.'
                : 'Best for investors who follow chart structures and price breakouts.'}
            </span>
          </div>
        </div>

        {/* Model 2: Quantitative Delta */}
        <div className="bg-slate-950/60 border border-blue-500/30 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-400" />
                {language === 'es' ? 'Algoritmo 2' : 'Algorithm 2'}
              </span>
              <span className="text-xs text-slate-400">
                {language === 'es' ? 'Estadístico / Cuantitativo' : 'Statistical / Quantitative'}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-2">{t.quantModelName}</h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              {language === 'es'
                ? 'Un enfoque puramente matemático basado en la distribución normal estándar de Black-Scholes y la Volatilidad Histórica Anualizada (HV) a 30 días de los rendimientos logarítmicos del oro.'
                : 'A purely mathematical approach using the Black-Scholes standard normal distribution and 30-day Historical Annualized Volatility (HV) of daily log returns to guarantee a calibrated safety buffer.'}
            </p>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <strong className="text-blue-300 block mb-0.5">
                  {language === 'es' ? '🎯 Objetivo ~0.16 Delta:' : '🎯 The ~0.16 Delta Target:'}
                </strong>
                {language === 'es'
                  ? 'La Delta mide la probabilidad aproximada de terminar In-the-Money (ITM). Una Delta de 0.16 equivale a 1 desviación típica fuera del dinero en una distribución gaussiana.'
                  : 'Delta measures option price sensitivity and serves as an accurate proxy for the probability of expiring ITM. A 0.16 Delta corresponds to 1 standard deviation Out-of-the-Money.'}
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <strong className="text-emerald-300 block mb-0.5">
                  {language === 'es' ? '📈 ~84% Probabilidad de Éxito:' : '📈 ~84% Statistical Win Rate:'}
                </strong>
                {language === 'es'
                  ? 'Como 1 desviación típica cubre ~68.2% de la campana de Gauss, la probabilidad de que el oro supere el strike es solo de ~15.9%. Esto otorga un ~84.1% de probabilidad de expirar sin valor y conservar el 100% del efectivo cobrado.'
                  : 'Because 1 standard deviation encompasses ~68.2% of two-tailed normal variance, the upper tail probability of being breached is only ~15.9%. This yields an estimated ~84.1% probability of expiring worthless.'}
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
                <strong className="text-cyan-300 block mb-0.5">
                  {language === 'es' ? '⏳ Decaimiento Temporal Óptimo (30 DTE):' : '⏳ Optimal 30-Day Theta Decay:'}
                </strong>
                {language === 'es'
                  ? 'Apunta al tramo de 30 a 45 días a vencimiento, situado exactamente en el punto de máxima aceleración del decaimiento temporal (curva Theta).'
                  : 'Targets 30 to 45 DTE, which sits squarely in the sweet spot of the exponential option time-decay curve.'}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
            <Target className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span>
              {language === 'es'
                ? 'Ideal para inversores cuantitativos que exigen reglas matemáticas y probabilidades estrictas.'
                : 'Best for quantitative investors who want disciplined, formulaic probability.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
