import React from 'react';
import { ShieldCheck, Settings, RefreshCw, ExternalLink, Globe } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenApiSettings: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  hasApiKey: boolean;
  dataSource: 'live_api' | 'verified_cache';
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenApiSettings,
  onRefresh,
  isLoading,
  hasApiKey,
  dataSource,
}) => {
  const t = translations[language];

  return (
    <header className="border-b border-slate-800 pb-5 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="bg-amber-500 text-slate-950 font-bold px-2.5 py-1 text-xs rounded tracking-wider shadow-sm">
              {t.appBadge}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {t.appTitle}
            </h1>
            <span className="text-xs text-slate-400 border border-slate-700 rounded px-2 py-0.5 hidden sm:inline-block">
              {t.appSubtitle}
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">{t.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            title={language === 'en' ? 'Cambiar a Español' : 'Switch to English'}
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono">{language === 'en' ? '🇪🇸 ES' : '🇬🇧 EN'}</span>
          </button>

          {/* Refresh Analysis */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors disabled:opacity-50"
            title={t.refresh}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span>{t.refresh}</span>
          </button>

          {/* Twelve Data API settings */}
          <button
            onClick={onOpenApiSettings}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border rounded-lg transition-colors ${
              hasApiKey
                ? 'bg-slate-800/80 text-emerald-400 border-emerald-500/40 hover:bg-slate-800'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{hasApiKey ? t.twelveDataActive : t.twelveDataConfig}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800/60 gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{t.marketInfo}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            Source:{' '}
            <strong className={dataSource === 'live_api' ? 'text-emerald-400' : 'text-amber-400'}>
              {dataSource === 'live_api' ? t.dataSourceLive : t.dataSourceVerified}
            </strong>
          </span>
          <a
            href="https://freedom24.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-200 inline-flex items-center gap-1 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.freedomReady}</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>
    </header>
  );
};
