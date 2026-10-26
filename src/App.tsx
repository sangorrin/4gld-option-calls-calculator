import React, { useState, useEffect, useCallback } from 'react';
import { Candle, RecommendationResult } from './types';
import { verified4GLDCandles } from './data/mock4GLDData';
import { analyzeMarket } from './utils/indicators';
import { fetchTwelveDataCandles, getStoredApiKey } from './utils/twelveDataApi';
import { Header } from './components/Header';
import { LiveAnalysisCard } from './components/LiveAnalysisCard';
import { BacktestCard } from './components/BacktestCard';
import { GrandmotherGlossary } from './components/GrandmotherGlossary';
import { AlgorithmExplainer } from './components/AlgorithmExplainer';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Language, translations } from './i18n/translations';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('goldrent_lang');
      if (saved === 'en' || saved === 'es') return saved;
      // Default to browser language if Spanish
      return navigator.language.startsWith('es') ? 'es' : 'en';
    } catch {
      return 'en';
    }
  });

  const [candles, setCandles] = useState<Candle[]>(verified4GLDCandles);
  const [dataSource, setDataSource] = useState<'live_api' | 'verified_cache'>('verified_cache');
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [cavaRec, setCavaRec] = useState<RecommendationResult | null>(null);
  const [quantRec, setQuantRec] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);

  const t = translations[language];

  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'es' : 'en';
    setLanguage(nextLang);
    try {
      localStorage.setItem('goldrent_lang', nextLang);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const key = getStoredApiKey();
    setHasApiKey(Boolean(key));
  }, []);

  // Compute recommendations for BOTH models simultaneously
  const computeRecommendations = useCallback((candleList: Candle[]) => {
    try {
      const cava = analyzeMarket(candleList, 'cava');
      const quant = analyzeMarket(candleList, 'quant_delta');
      setCavaRec(cava);
      setQuantRec(quant);
    } catch (err) {
      console.error('Failed to compute recommendations:', err);
    }
  }, []);

  // Fetch or refresh data
  const loadMarketData = useCallback(async () => {
    setIsLoading(true);
    setWarningMessage(null);
    try {
      const result = await fetchTwelveDataCandles();
      setCandles(result.candles);
      setDataSource(result.source);
      if (result.warning) {
        setWarningMessage(result.warning);
      }
      computeRecommendations(result.candles);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Error fetching market data:', msg);
      setWarningMessage(
        language === 'es'
          ? `Aviso: ${msg}. Mostrando datos verificados de Fráncfort XETRA.`
          : `Notice: ${msg}. Showing verified Frankfurt Xetra historical feed.`
      );
      setCandles(verified4GLDCandles);
      setDataSource('verified_cache');
      computeRecommendations(verified4GLDCandles);
    } finally {
      setIsLoading(false);
    }
  }, [computeRecommendations, language]);

  useEffect(() => {
    loadMarketData();
  }, [loadMarketData]);

  const handleKeyUpdated = () => {
    const key = getStoredApiKey();
    setHasApiKey(Boolean(key));
    loadMarketData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        {/* Header with Language Selector */}
        <Header
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onOpenApiSettings={() => setIsApiModalOpen(true)}
          onRefresh={loadMarketData}
          isLoading={isLoading}
          hasApiKey={hasApiKey}
          dataSource={dataSource}
        />

        {/* Top Disclaimer Banner */}
        <DisclaimerBanner language={language} />

        {/* Warning / Notification Banner if applicable */}
        {warningMessage && (
          <div className="mb-6 p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{warningMessage}</span>
            </div>
            <button
              onClick={() => setWarningMessage(null)}
              className="text-amber-400 hover:text-amber-200 font-bold px-2 py-0.5 rounded"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Content Sections */}
        <main className="space-y-6">
          {/* Section 1: Live Recommendation Dashboard (Shows BOTH models side-by-side) */}
          {cavaRec && quantRec && (
            <LiveAnalysisCard
              cavaRec={cavaRec}
              quantRec={quantRec}
              language={language}
            />
          )}

          {/* Section 2: Historical Simulation / Backtest Mode (Shows BOTH models evaluated simultaneously) */}
          <BacktestCard candles={candles} language={language} />

          {/* Section 3: Prerequisites & Grandmother Glossary */}
          <GrandmotherGlossary language={language} />

          {/* Section 4: Algorithm Explanations (Always displays BOTH models) */}
          <AlgorithmExplainer language={language} />
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-slate-400 font-semibold">{t.appTitle}</span> · 4GLD:XETR Covered Call Engine.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleLanguage}
              className="text-amber-400/90 hover:text-amber-300 hover:underline"
            >
              {language === 'en' ? 'Español' : 'English'}
            </button>
            <span>·</span>
            <span>{language === 'es' ? 'Fines Educativos' : 'Educational Purposes Only'}</span>
          </div>
        </footer>
      </div>

      {/* API Modal */}
      <ApiSettingsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onKeyUpdated={handleKeyUpdated}
        language={language}
      />
    </div>
  );
}
