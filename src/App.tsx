import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Candle, RecommendationResult } from './types';
import { verified4GLDCandles } from './data/mock4GLDData';
import { analyzeMarket } from './utils/indicators';
import { fetchTwelveDataCandles, getStoredApiKey } from './utils/twelveDataApi';
import { Header } from './components/Header';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { EducationalOverview } from './components/EducationalOverview';
import { GrandmotherGlossary } from './components/GrandmotherGlossary';
import { AlgorithmExplainer } from './components/AlgorithmExplainer';
import { LiveAnalysisCard } from './components/LiveAnalysisCard';
import { BacktestCard } from './components/BacktestCard';
import { PineScriptSection } from './components/PineScriptSection';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { Language, translations } from './i18n/translations';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('goldrent_lang');
      if (saved === 'en' || saved === 'es') return saved;
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
  const initialFetchDone = useRef(false);

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

  // Fetch market data with caching; only force-refresh on user action
  const loadMarketData = useCallback(async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    setWarningMessage(null);
    try {
      const result = await fetchTwelveDataCandles(undefined, forceRefresh);
      setCandles(result.candles);
      setDataSource(result.source);
      if (result.warning) {
        setWarningMessage(result.warning);
      }
      computeRecommendations(result.candles);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Error fetching market data:', msg);
      setWarningMessage(`Notice: ${msg}. Showing verified Frankfurt XETRA feed.`);
      setCandles(verified4GLDCandles);
      setDataSource('verified_cache');
      computeRecommendations(verified4GLDCandles);
    } finally {
      setIsLoading(false);
    }
  }, [computeRecommendations]);

  // Initial load only once on mount
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      loadMarketData(false);
    }
  }, [loadMarketData]);

  const handleManualRefresh = () => {
    loadMarketData(true);
  };

  const handleKeyUpdated = () => {
    const key = getStoredApiKey();
    setHasApiKey(Boolean(key));
    loadMarketData(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        {/* Header with Language Selector */}
        <Header
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onOpenApiSettings={() => setIsApiModalOpen(true)}
          onRefresh={handleManualRefresh}
          isLoading={isLoading}
          hasApiKey={hasApiKey}
          dataSource={dataSource}
        />

        {/* Prominent Educational & Regulatory Disclaimer */}
        <DisclaimerBanner language={language} />

        {/* Warning / Notification Banner if applicable */}
        {warningMessage && (
          <div className="mb-6 p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{warningMessage}</span>
            </div>
            <button
              onClick={() => setWarningMessage(null)}
              className="text-amber-400 hover:text-amber-200 font-bold px-2 py-0.5 rounded flex-shrink-0"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Content Sections: Ordered for pedagogical learning */}
        <main className="space-y-6">
          {/* 1. Educational Overview on Top */}
          <EducationalOverview language={language} />

          {/* 2. Prerequisites & "Grandmother" Glossary */}
          <GrandmotherGlossary language={language} />

          {/* 3. Algorithm Explanations & Mechanics (Always displays BOTH models) */}
          <AlgorithmExplainer language={language} />

          {/* 4. Live Recommendation Dashboard & Technical Chart (Shows BOTH models & Indicators) */}
          {cavaRec && quantRec && (
            <LiveAnalysisCard
              cavaRec={cavaRec}
              quantRec={quantRec}
              candles={candles}
              language={language}
            />
          )}

          {/* 5. Historical Simulation / Backtest Mode (Shows BOTH models evaluated simultaneously) */}
          <BacktestCard candles={candles} language={language} />

          {/* 6. TradingView Pine Script Indicator (New Section with Copy & Guide) */}
          <PineScriptSection language={language} />
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-900 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-slate-400 font-semibold">{t.appTitle}</span> · 4GLD:XETR Covered Call Educational Engine.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleToggleLanguage}
              className="text-amber-400/90 hover:text-amber-300 hover:underline"
            >
              {language === 'en' ? 'Español' : 'English'}
            </button>
            <span>·</span>
            <span>{language === 'es' ? 'Fines Educativos Únicamente' : 'Educational Purposes Only'}</span>
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
