import React from 'react';
import { GraduationCap, ShieldCheck, Cpu, Scale } from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface EducationalOverviewProps {
  language: Language;
}

export const EducationalOverview: React.FC<EducationalOverviewProps> = ({ language }) => {
  const t = translations[language];

  return (
    <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 mb-6 shadow-xl relative overflow-hidden">
      <div className="flex items-start gap-3.5 mb-4 border-b border-slate-800/80 pb-4">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 mt-0.5 flex-shrink-0">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">{t.overviewTitle}</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.overviewSubtitle}</p>
        </div>
      </div>

      <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
        <p>{t.overviewP1}</p>
        <p className="text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs italic">
          {t.overviewP2}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
              {t.overviewCard1Title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{t.overviewCard1Desc}</p>
        </div>

        <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              {t.overviewCard2Title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{t.overviewCard2Desc}</p>
        </div>

        <div className="bg-slate-950/70 border border-blue-500/30 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-blue-300 uppercase tracking-wide">
              {t.overviewCard3Title}
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{t.overviewCard3Desc}</p>
        </div>
      </div>
    </section>
  );
};
