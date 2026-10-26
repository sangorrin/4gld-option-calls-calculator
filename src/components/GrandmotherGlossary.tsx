import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Coins,
  ShieldAlert,
  Sparkles,
  Calendar,
  DollarSign,
  Repeat,
} from 'lucide-react';
import { Language, translations } from '../i18n/translations';

interface GrandmotherGlossaryProps {
  language: Language;
}

export const GrandmotherGlossary: React.FC<GrandmotherGlossaryProps> = ({ language }) => {
  const t = translations[language];
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'what-is-4gld': true,
    'recurring-income': true,
  });

  const toggle = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isEs = language === 'es';

  const glossaryItems = [
    {
      id: 'what-is-4gld',
      icon: <Coins className="w-4 h-4 text-amber-400" />,
      title: isEs ? '1. ¿Qué es 4GLD (Xetra-Gold)?' : '1. What is 4GLD (Xetra-Gold)?',
      simpleSubtitle: isEs
        ? 'Cada acción en tu cuenta equivale a 1 gramo de oro físico custodiado en una bóveda en Fráncfort.'
        : 'Each share in your account is 1 gram of real gold in a vault.',
      analogy: isEs
        ? 'Tener un ticket de custodia numerado para una barra de oro real en Fráncfort, Alemania.'
        : 'Imagine having a numbered claim ticket for a real gold bar stored in Frankfurt, Germany.',
      explanation: isEs ? (
        <div className="space-y-2 text-slate-300">
          <p>
            <strong>4GLD</strong> es un valor de deuda emitido por Deutsche Börse Commodities. Cada acción comprada representa exactamente <strong>1 gramo de oro físico 99.99% puro</strong> custodiado en las bóvedas de Clearstream Banking en Fráncfort.
          </p>
          <p>
            A diferencia de los futuros en papel, los titulares de 4GLD tienen el derecho legal explícito de solicitar la entrega física de sus lingotes directamente a su entidad bancaria.
          </p>
        </div>
      ) : (
        <div className="space-y-2 text-slate-300">
          <p>
            <strong>4GLD</strong> is an exchange-traded commodity issued by Deutsche Börse Commodities. Every single share purchased represents exactly <strong>1 gram of 99.99% pure physical gold</strong> stored in the underground vaults of Clearstream Banking in Frankfurt.
          </p>
          <p>
            Unlike paper futures or synthetic certificates, holders of 4GLD even have the legal right to request physical delivery of their gold bars directly to their bank.
          </p>
        </div>
      ),
    },
    {
      id: 'options-contract',
      icon: <BookOpen className="w-4 h-4 text-blue-400" />,
      title: isEs ? '2. Contrato de Opciones' : '2. Options Contract',
      simpleSubtitle: isEs
        ? 'Un acuerdo legal de reserva temporal entre dos partes.'
        : 'A legal reservation agreement between two parties.',
      analogy: isEs
        ? 'Una fianza que le permite a alguien comprar tu coche el mes que viene a un precio fijado hoy.'
        : 'A refundable deposit ticket that allows someone to buy your car next month at an agreed price.',
      explanation: isEs ? (
        <div className="space-y-2 text-slate-300">
          <p>
            Un <strong>contrato de opciones</strong> es un acuerdo estandarizado negociado en mercados regulados (como Eurex). Otorga al comprador el derecho—pero no la obligación—de comprar o vender un activo a un precio fijado antes de una fecha límite.
          </p>
          <p>
            Como inversor conservador, no compras billetes de lotería especulativos: <strong>tú eres quien vende la reserva a otro</strong> y cobra el dinero en efectivo por adelantado el primer día.
          </p>
        </div>
      ) : (
        <div className="space-y-2 text-slate-300">
          <p>
            An <strong>options contract</strong> is a standardized financial contract traded on regulated exchanges (like Eurex). It gives the buyer the right—but not the obligation—to buy or sell an asset at a predetermined price on or before a specified date.
          </p>
          <p>
            As a conservative investor, you are not buying speculation tickets; <strong>you are selling the ticket to someone else</strong> and pocketing immediate cash upfront.
          </p>
        </div>
      ),
    },
    {
      id: 'call-option',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      title: isEs ? '3. Opción Call (Opción de Compra)' : '3. Call Option',
      simpleSubtitle: isEs
        ? 'El derecho específico a comprar a un precio fijo fijado de antemano.'
        : 'The specific right to buy at a fixed price.',
      analogy: isEs
        ? 'Un cupón que permite a un comprador adquirir mantequilla a 2.50 € sin importar la inflación.'
        : 'A voucher that lets a shopper buy butter at €2.50 no matter how high inflation goes.',
      explanation: isEs ? (
        <div className="space-y-2 text-slate-300">
          <p>
            Una <strong>Opción Call</strong> concede al comprador el derecho a <em>comprar</em> las acciones al vendedor al precio de ejercicio acordado (Strike).
          </p>
          <p>
            Al <strong>vender una Call</strong>, aceptas: <em>"Si el oro se mantiene por debajo del techo fijado, me quedo tu dinero y sigo teniendo mi oro. Si el oro supera ese techo, te vendo mi oro al precio acordado y me quedo también con tu prima en efectivo."</em>
          </p>
        </div>
      ) : (
        <div className="space-y-2 text-slate-300">
          <p>
            A <strong>Call Option</strong> specifically grants the buyer the right to <em>buy</em> shares from the seller at the agreed strike price.
          </p>
          <p>
            When you <strong>sell (write) a Call</strong>, you agree: <em>"If gold stays below our agreed ceiling, I keep your cash and keep my gold. If gold shoots above that ceiling, I agree to sell you my gold at that agreed ceiling price."</em>
          </p>
        </div>
      ),
    },
    {
      id: 'covered-rule',
      icon: <ShieldAlert className="w-4 h-4 text-emerald-400" />,
      title: isEs
        ? '4. Covered (La Regla de las 100 Acciones) - Por qué NO hay riesgo ilimitado'
        : '4. Covered (The 100-Share Rule) - Why There Is ZERO Unlimited Risk',
      simpleSubtitle: isEs
        ? 'Debes poseer 100 acciones de 4GLD por cada 1 contrato Call vendido.'
        : 'You must own 100 shares of 4GLD for every 1 Call sold.',
      analogy: isEs
        ? 'Alquilar una vivienda que ya tienes en propiedad vs. alquilar una vivienda que no tienes.'
        : 'Renting out an apartment you actually own vs. renting out an apartment you do not own.',
      explanation: isEs ? (
        <div className="space-y-2 text-slate-300">
          <p>
            En los mercados europeos (Eurex / Freedom24), <strong>1 contrato de opciones controla exactamente 100 acciones de 4GLD</strong> (100 gramos de oro físico).
          </p>
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-lg text-emerald-200 text-xs">
            <strong>REGLA FUNDAMENTAL:</strong> Una Call está estrictamente <em>"Cubierta" (Covered)</em> solo cuando ya posees las 100 acciones en tu cuenta antes de vender. Dado que ya tienes los 100g de oro físico, <strong>no asumes ningún riesgo ilimitado</strong>. Incluso si el oro se multiplicara por diez de golpe, jamás tendrías que pagar dinero extra de tu bolsillo: simplemente entregas el oro que ya tenías al precio de strike acordado.
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-slate-300">
          <p>
            In European options (Eurex/Freedom24), <strong>1 options contract controls exactly 100 shares of 4GLD</strong> (100 grams of physical gold).
          </p>
          <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-lg text-emerald-200 text-xs">
            <strong>CRITICAL RULE:</strong> A call is strictly <em>"Covered"</em> only when you already own all 100 shares in your account. Because you already hold the 100 grams of gold, you face <strong>no unlimited risk</strong>. Even if gold shoots up to €500/gram overnight, you never owe any extra money out-of-pocket—you simply deliver the gold you already owned at your agreed profit strike!
          </div>
        </div>
      ),
    },
    {
      id: 'strike-price',
      icon: <Coins className="w-4 h-4 text-amber-300" />,
      title: isEs ? '5. Strike (Precio de Ejercicio)' : '5. Strike Price',
      simpleSubtitle: isEs
        ? 'El precio techo pactado al que venderías tu oro.'
        : 'The agreed ceiling sell price.',
      analogy: isEs
        ? 'La etiqueta de precio a la que te comprometes a vender si el comprador ejerce su ticket.'
        : 'The price tag you agreed to sell your gold for if the buyer decides to exercise their ticket.',
      explanation: isEs ? (
        <div className="space-y-2 text-slate-300">
          <p>
            El <strong>Strike Price</strong> es el precio exacto en euros al que te comprometes a vender tus acciones de 4GLD.
          </p>
          <p>
            Elegimos deliberadamente strikes <strong>por encima</strong> del precio actual del oro (Out-of-the-Money). Si el oro cotiza hoy a 88 €, elegimos un strike de 92 € o 94 €. Así el oro tiene margen para subir mientras cobramos la prima completa en efectivo si no supera ese techo.
          </p>
        </div>
      ) : (
        <div className="space-y-2 text-slate-300">
          <p>
            The <strong>Strike Price</strong> is the exact price in Euros at which you agree to sell your 4GLD shares.
          </p>
          <p>
            We intentionally choose strike prices <strong>above</strong> today's market price (Out-of-the-Money). If gold trades at €88 today, we might choose a €92 strike. That gives gold room to rise +4.5% while still letting us keep 100% of the cash premium if it stays below €92.
          </p>
        </div>
      ),
    },
    {
      id: 'expiration-dte',
      icon: <Calendar className="w-4 h-4 text-cyan-400" />,
      title: isEs ? '6. Vencimiento y DTE (Días hasta Expiración)' : '6. Expiration Date & DTE',
      simpleSubtitle: isEs
        ? 'La fecha límite en la que el contrato expira.'
        : 'The deadline when the agreement terminates.',
      analogy: isEs
        ? 'La fecha de caducidad de un contrato de alquiler o fianza temporal.'
        : 'The expiration date on a milk carton or lease contract.',
      explanation: isEs ? (
        <div className="space-y-2 text-slate-300">
          <p>
            <strong>DTE (Days to Expiration)</strong> es el número de días naturales restantes hasta el vencimiento.
          </p>
          <p>
            En las opciones, el tiempo juega a tu favor gracias al <strong>decaimiento temporal (Theta)</strong>. Cada noche que duermes, el valor del ticket que vendiste pierde valor en tu beneficio, aproximándose a cero al expirar.
          </p>
        </div>
      ) : (
        <div className="space-y-2 text-slate-300">
          <p>
            <strong>DTE (Days to Expiration)</strong> is the number of calendar days until the contract expires.
          </p>
          <p>
            In options, time works in your favor through <strong>Theta decay</strong>. Every night that you sleep, the value of the option ticket that you sold drops closer to zero, eroding in your favor until it reaches expiration day.
          </p>
        </div>
      ),
    },
    {
      id: 'cash-premium',
      icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
      title: isEs ? '7. Prima en Efectivo (Premium)' : '7. Premium',
      simpleSubtitle: isEs
        ? 'Dinero líquido abonado directamente en tu cuenta desde el primer instante.'
        : 'Immediate cash credited to your brokerage balance on Day 1.',
      analogy: isEs
        ? 'Una fianza no reembolsable que ingresa en tu cuenta bancaria al firmar el contrato.'
        : 'A non-refundable deposit that clears in your bank account the second you sign the agreement.',
      explanation: isEs ? (
        <div className="space-y-2 text-slate-300">
          <p>
            <strong>La prima</strong> es el dinero en efectivo que paga el comprador por adelantado. Por ejemplo, al vender una Call a 1.50 € por acción sobre 100 acciones, <strong>se te ingresan 150.00 € en efectivo de inmediato en tu cuenta de Freedom24</strong>.
          </p>
          <p>
            Este dinero es 100% tuyo de forma irreversible, sin importar lo que haga el precio del oro después.
          </p>
        </div>
      ) : (
        <div className="space-y-2 text-slate-300">
          <p>
            <strong>The Premium</strong> is the cash paid by the buyer upfront. For example, if you sell a call for €1.50 per share on 100 shares, <strong>€150.00 cash is immediately credited to your Freedom24 account balance</strong>.
          </p>
          <p>
            This cash is 100% yours to keep permanently, whether gold rises, falls, or stays completely flat!
          </p>
        </div>
      ),
    },
    {
      id: 'recurring-income',
      icon: <Repeat className="w-4 h-4 text-amber-400" />,
      title: isEs
        ? '8. Cómo se Generan Ingresos Recurrentes: El Modelo de "Alquiler de Oro"'
        : '8. How Recurring Income is Made: The 3-Step "Gold Rent" Engine',
      simpleSubtitle: isEs
        ? 'Convertir el oro físico improductivo en un flujo de efectivo mensual constante.'
        : 'Turning dead-weight physical gold into an active monthly income stream.',
      analogy: isEs
        ? 'Alquilar un inmueble: el inquilino paga la renta mes tras mes y tú sigues manteniendo la propiedad del inmueble.'
        : 'Renting out real estate: the tenant pays rent every month, and you still own the physical property.',
      explanation: isEs ? (
        <div className="space-y-3 text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
              <span className="font-bold text-amber-400 block mb-1">Paso 1: Tener 100 Acciones</span>
              Comprar y mantener 100 acciones de 4GLD (100 gramos de oro) en tu cuenta de broker.
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
              <span className="font-bold text-blue-400 block mb-1">Paso 2: Vender 1 Call al Mes</span>
              Utilizar el algoritmo para elegir un strike fuera del dinero a 15–30 días y cobrar 80 €–180 € en efectivo inmediato.
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
              <span className="font-bold text-emerald-400 block mb-1">Paso 3: Repetir y Capitalizar</span>
              Si expira sin valor, conservas el oro y vendes otra Call el mes siguiente. Repite 12 veces al año para obtener rentabilidades anualizadas del 10%–20% sobre tu oro.
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
              <span className="font-bold text-amber-400 block mb-1">Step 1: Own 100 Shares</span>
              Purchase 100 shares of 4GLD (100 grams of gold) once in your brokerage account.
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
              <span className="font-bold text-blue-400 block mb-1">Step 2: Sell 1 Call Monthly</span>
              Use the algorithm to pick an out-of-the-money strike 15–30 days out. Collect €80–€180 cash upfront.
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
              <span className="font-bold text-emerald-400 block mb-1">Step 3: Repeat & Compound</span>
              When the option expires worthless, keep the cash and sell another call next month. Repeat 12 times a year for 10%–20% annualized cash yield on gold!
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-semibold text-white">{t.glossaryTitle}</h2>
        </div>
        <span className="text-xs text-slate-400">{t.glossarySubtitle}</span>
      </div>

      <div className="space-y-2.5">
        {glossaryItems.map((item) => {
          const isOpen = !!openItems[item.id];
          return (
            <div
              key={item.id}
              className={`border rounded-lg transition-colors overflow-hidden ${
                isOpen
                  ? 'bg-slate-950/70 border-slate-700'
                  : 'bg-slate-950/30 border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-slate-900 border border-slate-800 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{item.simpleSubtitle}</p>
                  </div>
                </div>
                <div className="text-slate-400 p-1 flex-shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 text-xs text-slate-300">
                  <div className="bg-amber-500/10 border-l-2 border-amber-500 px-3 py-1.5 rounded-r mb-3 text-amber-200/90 text-xs italic">
                    💡 <strong>{t.analogyLabel}:</strong> {item.analogy}
                  </div>
                  {item.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
