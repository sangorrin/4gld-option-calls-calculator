import React, { useState, useEffect } from 'react';
import { Key, ExternalLink, Check, AlertCircle, Trash2, X } from 'lucide-react';
import { getStoredApiKey, saveApiKey, removeApiKey } from '../utils/twelveDataApi';
import { Language, translations } from '../i18n/translations';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
  language: Language;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  onKeyUpdated,
  language,
}) => {
  const t = translations[language];
  const [apiKey, setApiKey] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setFeedback(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      removeApiKey();
      setFeedback({
        type: 'success',
        message: language === 'es' ? 'Clave eliminada. Usando datos verificados de Fráncfort.' : 'API key removed. Using verified Frankfurt Xetra feed.',
      });
      onKeyUpdated();
      return;
    }

    saveApiKey(trimmed);
    setFeedback({
      type: 'success',
      message:
        language === 'es'
          ? '¡Clave guardada en localStorage! Las cotizaciones en vivo se consultarán directamente.'
          : 'API Key saved to localStorage! Live quotes for 4GLD:XETR will now be fetched directly.',
    });
    onKeyUpdated();
  };

  const handleClear = () => {
    removeApiKey();
    setApiKey('');
    setFeedback({
      type: 'success',
      message: language === 'es' ? 'Clave eliminada de localStorage.' : 'API key cleared from localStorage.',
    });
    onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{t.apiModalTitle}</h2>
            <p className="text-xs text-slate-400">{t.apiModalSubtitle}</p>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 mb-4 text-xs space-y-2 text-slate-300">
          <p>
            <strong>{t.apiModalInstructions}</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>
              {t.apiModalStep1}{' '}
              <a
                href="https://twelvedata.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                twelvedata.com <ExternalLink className="w-3 h-3 inline" />
              </a>
            </li>
            <li>{t.apiModalStep2}</li>
            <li>{t.apiModalStep3}</li>
          </ol>
        </div>

        <div className="space-y-3 mb-5">
          <label className="block text-xs font-semibold text-slate-200">
            {t.apiModalKeyLabel}
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="e.g. 9b8c7d6e5f4a3b2c1..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
          />

          {feedback && (
            <div
              className={`text-xs p-3 rounded-lg flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-950/50 text-rose-300 border border-rose-500/30'
              }`}
            >
              {feedback.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors border border-rose-900/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.apiModalRemove}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {t.apiModalClose}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
            >
              {t.apiModalSave}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
