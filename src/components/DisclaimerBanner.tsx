import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Language } from '../i18n/translations';

interface DisclaimerBannerProps {
  language: Language;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ language }) => {
  return (
    <div className="bg-amber-950/25 border border-amber-500/35 rounded-xl p-4 my-6 shadow-md">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 mt-0.5 flex-shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs text-amber-200/95 leading-relaxed">
          <span className="font-bold uppercase tracking-wider block mb-1 text-amber-300">
            {language === 'es' ? 'Aviso Legal Importante' : 'Important Disclaimer'}
          </span>
          <p className="font-medium text-slate-200">
            Disclaimer: This software is for educational and informational purposes only and does not
            constitute financial, investment, or trading advice. Options trading involves substantial
            risk of loss and is not suitable for every investor. The author accepts no liability for
            any financial losses incurred from using this tool or its models.
          </p>
          {language === 'es' && (
            <p className="mt-1.5 text-amber-300/80 text-[11px] italic">
              (Descargo de responsabilidad: Este software tiene fines educativos e informativos
              únicamente y no constituye asesoramiento financiero, de inversión ni de negociación. La
              operativa con opciones conlleva un riesgo sustancial de pérdida y no es adecuada para
              todos los inversores. El autor no asume responsabilidad alguna por las pérdidas
              financieras derivadas del uso de esta herramienta o de sus modelos.)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
