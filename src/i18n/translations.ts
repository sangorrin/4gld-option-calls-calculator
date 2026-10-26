export type Language = 'en' | 'es';

export const translations = {
  en: {
    appTitle: 'GoldRent Assistant',
    appBadge: '4GLD',
    appSubtitle: 'Automated Covered Call strategy planner & backtester for Xetra-Gold',
    description: 'Generate weekly income on physical gold without taking on unlimited risk. Designed for beginners.',
    marketInfo: 'Market: Deutsche Börse Xetra (Frankfurt) · ISIN: DE000A0S9GB0 · 1 Share = 1g Pure Gold',
    dataSourceLive: 'Twelve Data Live REST',
    dataSourceVerified: 'Verified Frankfurt Feed',
    freedomReady: 'Freedom24 Ready',
    refresh: 'Refresh Analysis',
    twelveDataActive: 'Twelve Data: Active',
    twelveDataConfig: 'Twelve Data API',
    
    // Disclaimer
    disclaimerTitle: 'Regulatory & Risk Disclaimer',
    disclaimerText:
      'Disclaimer: This software is for educational and informational purposes only and does not constitute financial, investment, or trading advice. Options trading involves substantial risk of loss and is not suitable for every investor. The author accepts no liability for any financial losses incurred from using this tool or its models.',
    
    // Live Dashboard
    liveDashboardTitle: 'Live Execution Dashboard',
    liveDashboardSubtitle: 'Weekly automated Covered Call action recommendations for 4GLD. Both strategies are displayed side-by-side.',
    currentSpot: 'Spot Price (1g Gold)',
    regimeBullish: 'Bullish Regime',
    regimeNeutral: 'Neutral / Sideways Regime',
    regimeBearish: 'Bearish / Corrective Regime',
    
    // Traffic Light
    trafficGreenTitle: 'Favorable Moment (Green Light)',
    trafficGreenDesc: 'Gold is extended near resistance and options implied volatility is juicy. Ideal moment to capture peak cash premium with high statistical buffer.',
    trafficYellowTitle: 'Neutral Market (Yellow Light)',
    trafficYellowDesc: 'Standard market conditions. Gold is trading in equilibrium. Stick to the algorithmic strikes and maintain your 100-share coverage.',
    trafficRedTitle: 'Caution / Wait (Red Light)',
    trafficRedDesc: 'Market is temporarily oversold after a sharp drop. Selling a call right now risks locking in depressed prices and yields low premium. Wait for a green bounce.',
    
    // Model Names
    cavaModelName: 'Algorithm 1: José Luis Cava Model',
    cavaModelSubtitle: 'Trend & Resistance (SMA 20/50 + Swing Highs)',
    quantModelName: 'Algorithm 2: Quantitative Delta Model',
    quantModelSubtitle: 'Statistical Normal Distribution (~0.16 Delta, ~84% Probability)',
    
    // Metrics
    targetStrike: 'Recommended Strike',
    targetExpiry: 'Target Expiration',
    cashPremium: 'Cash Premium (100 sh.)',
    annualizedYield: 'Annualized Yield',
    strikeBuffer: 'Buffer above spot',
    probOtm: 'Prob. Expiring OTM',
    estimatedDelta: 'Delta',
    daysToExpiry: 'DTE',
    immediateCash: 'Immediate Cash',
    
    // Freedom24 Guide
    freedomTitle: 'Freedom24 Step-by-Step Execution Guide',
    freedomStep1Title: 'STEP 1: VERIFY SHARES',
    freedomStep1Desc: 'Own 100 shares of 4GLD in your portfolio (1 contract = 100g of gold).',
    freedomStep2Title: 'STEP 2: FIND OPTIONS',
    freedomStep2Desc: 'Search 4GLD -> Options tab -> Locate Call side.',
    freedomStep3Title: 'STEP 3: SELECT STRIKE & EXPIRY',
    freedomStep3Desc: 'Filter expiry date and pick Strike ≥ recommended floor.',
    freedomStep4Title: 'STEP 4: SUBMIT ORDER',
    freedomStep4Desc: 'Click "Sell to Open" 1 contract at midpoint limit price. Pocket cash upfront.',
    copyInstructions: 'Copy Instructions',
    copiedInstructions: 'Copied to Clipboard!',
    
    // What If Simulator
    simulatorTitle: 'Interactive What-If Scenario Simulator',
    simulatorSubtitle: 'Simulate Gold Price on Expiration Day',
    simulatedPrice: 'Simulated Expiration Price',
    sharesRetained: 'Below Strike &rarr; 100% Shares Retained',
    sharesAssigned: 'Above Strike &rarr; Shares Sold at Strike',
    premiumKept: 'Upfront Cash Premium',
    goldChange: 'Gold Value Change (100 sh.)',
    netReturn: 'Total Net Return',
    
    // Backtest
    backtestTitle: 'Historical Backtest ("Test on Past Data")',
    backtestSubtitle: 'Pick any past trading day. The engine slices history with zero lookahead and evaluates both algorithms side-by-side.',
    choosePastDate: 'Choose Historical Entry Date:',
    testDate: 'Test Date',
    entrySpot: 'Entry Spot Price',
    finalSpot: 'Final Settlement Price',
    bothModelsCompared: 'Both Algorithms Evaluated Side-by-Side:',
    subsequentPath: 'Subsequent Price Path vs. Recommended Strikes',
    chartLegendCava: 'Cava Strike',
    chartLegendQuant: 'Quant Delta Strike',
    chartLegendPath: 'Actual Gold Price Path',
    
    // Grandmother Glossary
    glossaryTitle: 'Prerequisites & "Grandmother" Glossary',
    glossarySubtitle: 'Click any card to expand. Plain English explanations with no Wall Street jargon.',
    analogyLabel: 'Real-World Analogy',
    
    // Algorithm Explainer
    algoExplainerTitle: 'Algorithm Explanations & Mechanics',
    algoExplainerSubtitle: 'Both models are running permanently. Review their specific quantitative and technical rationale below.',
    
    // API Modal
    apiModalTitle: 'Twelve Data API Configuration',
    apiModalSubtitle: 'Direct real-time Frankfurt Stock Exchange market quotes',
    apiModalInstructions: 'How to get your free API key:',
    apiModalStep1: 'Go to twelvedata.com and register for a free plan.',
    apiModalStep2: 'Copy your API key from the Twelve Data dashboard.',
    apiModalStep3: 'Paste it below. It is stored securely in your browser localStorage only.',
    apiModalKeyLabel: 'Twelve Data API Key:',
    apiModalSave: 'Save & Apply Key',
    apiModalRemove: 'Remove Key',
    apiModalClose: 'Close',
  },
  es: {
    appTitle: 'GoldRent Assistant',
    appBadge: '4GLD',
    appSubtitle: 'Planificador y simulador automatizado de Covered Calls sobre Xetra-Gold',
    description: 'Genera ingresos periódicos sobre oro físico sin asumir riesgo ilimitado. Diseñado para principiantes.',
    marketInfo: 'Mercado: Deutsche Börse Xetra (Fráncfort) · ISIN: DE000A0S9GB0 · 1 Acción = 1g de Oro Puro',
    dataSourceLive: 'Twelve Data Live REST',
    dataSourceVerified: 'Datos Verificados Xetra Fráncfort',
    freedomReady: 'Listo para Freedom24',
    refresh: 'Actualizar Análisis',
    twelveDataActive: 'Twelve Data: Activo',
    twelveDataConfig: 'API Twelve Data',
    
    // Disclaimer
    disclaimerTitle: 'Aviso Legal y de Riesgo',
    disclaimerText:
      'Disclaimer: This software is for educational and informational purposes only and does not constitute financial, investment, or trading advice. Options trading involves substantial risk of loss and is not suitable for every investor. The author accepts no liability for any financial losses incurred from using this tool or its models. (Descargo de responsabilidad: Este software tiene fines educativos e informativos únicamente y no constituye asesoramiento financiero, de inversión ni de negociación. La operativa con opciones conlleva un riesgo sustancial de pérdida y no es adecuada para todos los inversores. El autor no asume responsabilidad alguna por las pérdidas financieras derivadas del uso de esta herramienta o de sus modelos.)',
    
    // Live Dashboard
    liveDashboardTitle: 'Panel de Ejecución en Vivo',
    liveDashboardSubtitle: 'Recomendaciones semanales automáticas de Covered Call para 4GLD. Ambos modelos se muestran simultáneamente.',
    currentSpot: 'Precio Spot (1g de Oro)',
    regimeBullish: 'Régimen Alcista',
    regimeNeutral: 'Régimen Lateral / Neutro',
    regimeBearish: 'Régimen Bajista / Correctivo',
    
    // Traffic Light
    trafficGreenTitle: 'Momento Favorable (Semáforo Verde)',
    trafficGreenDesc: 'El oro está en zona de resistencia y la volatilidad implícita está elevada. Momento óptimo para vender Calls con primas elevadas y amplio colchón estadístico.',
    trafficYellowTitle: 'Mercado Neutral (Semáforo Amarillo)',
    trafficYellowDesc: 'Condiciones estándar de mercado. El oro cotiza en equilibrio. Sigue los strikes recomendados manteniendo tu cobertura de 100 acciones.',
    trafficRedTitle: 'Precaución / Esperar (Semáforo Rojo)',
    trafficRedDesc: 'El mercado está sobrevendido tras una caída brusca. Vender una Call ahora corre el riesgo de fijar un precio bajo y da poca prima. Espera a un rebote verde.',
    
    // Model Names
    cavaModelName: 'Algoritmo 1: Modelo José Luis Cava',
    cavaModelSubtitle: 'Tendencia y Resistencias (SMA 20/50 + Máximos Previos)',
    quantModelName: 'Algoritmo 2: Modelo Cuantitativo Delta',
    quantModelSubtitle: 'Distribución Normal Estadística (~0.16 Delta, ~84% Probabilidad)',
    
    // Metrics
    targetStrike: 'Strike Recomendado',
    targetExpiry: 'Vencimiento Objetivo',
    cashPremium: 'Prima en Efectivo (100 acc.)',
    annualizedYield: 'Rentabilidad Anualizada',
    strikeBuffer: 'Colchón sobre el spot',
    probOtm: 'Prob. Expirar OTM',
    estimatedDelta: 'Delta',
    daysToExpiry: 'DTE',
    immediateCash: 'Efectivo Inmediato',
    
    // Freedom24 Guide
    freedomTitle: 'Guía de Ejecución Paso a Paso en Freedom24',
    freedomStep1Title: 'PASO 1: VERIFICAR ACCIONES',
    freedomStep1Desc: 'Poseer 100 acciones de 4GLD en cartera (1 contrato = 100g de oro).',
    freedomStep2Title: 'PASO 2: BUSCAR OPCIONES',
    freedomStep2Desc: 'Buscar 4GLD -> Pestaña Opciones -> Localizar columna Calls.',
    freedomStep3Title: 'PASO 3: SELECCIONAR STRIKE Y FECHA',
    freedomStep3Desc: 'Filtrar por la fecha de vencimiento y elegir Strike ≥ recomendado.',
    freedomStep4Title: 'PASO 4: ENVIAR ORDEN',
    freedomStep4Desc: 'Hacer clic en "Sell to Open" (Vender para abrir) 1 contrato a precio límite. Cobro inmediato.',
    copyInstructions: 'Copiar Instrucciones',
    copiedInstructions: '¡Copiado al Portapapeles!',
    
    // What If Simulator
    simulatorTitle: 'Simulador Interactivo de Escenarios',
    simulatorSubtitle: 'Simula el precio del oro el día del vencimiento',
    simulatedPrice: 'Precio Simulado a Vencimiento',
    sharesRetained: 'Por debajo del Strike &rarr; 100% de Acciones Mantenidas',
    sharesAssigned: 'Por encima del Strike &rarr; Acciones Vendidas al Strike',
    premiumKept: 'Prima en Efectivo Cobrada',
    goldChange: 'Variación Valor del Oro (100 acc.)',
    netReturn: 'Resultado Neto Total',
    
    // Backtest
    backtestTitle: 'Simulación Histórica ("Probar en Datos Pasados")',
    backtestSubtitle: 'Elige cualquier fecha pasada. El motor analiza el histórico sin sesgo futuro y evalúa ambos algoritmos.',
    choosePastDate: 'Elegir Fecha Histórica de Entrada:',
    testDate: 'Fecha de Prueba',
    entrySpot: 'Precio Spot de Entrada',
    finalSpot: 'Precio de Liquidación Final',
    bothModelsCompared: 'Ambos Algoritmos Evaluados Simultáneamente:',
    subsequentPath: 'Trayectoria Posterior del Oro vs. Strikes Recomendados',
    chartLegendCava: 'Strike Cava',
    chartLegendQuant: 'Strike Delta Cuantitativo',
    chartLegendPath: 'Precio Real del Oro',
    
    // Grandmother Glossary
    glossaryTitle: 'Requisitos Previos y Glosario "Para Principiantes"',
    glossarySubtitle: 'Haz clic en cualquier tarjeta para desplegar. Explicado con analogías sencillas sin tecnicismos.',
    analogyLabel: 'Analogía de la Vida Real',
    
    // Algorithm Explainer
    algoExplainerTitle: 'Explicación Detallada de los Algoritmos',
    algoExplainerSubtitle: 'Ambos modelos funcionan en paralelo. Revisa a continuación sus fundamentos técnicos y cuantitativos.',
    
    // API Modal
    apiModalTitle: 'Configuración API Twelve Data',
    apiModalSubtitle: 'Cotizaciones en tiempo real de la Bolsa de Fráncfort',
    apiModalInstructions: 'Cómo obtener tu clave API gratuita:',
    apiModalStep1: 'Entra en twelvedata.com y regístrate en el plan gratuito.',
    apiModalStep2: 'Copia tu clave API en tu panel de control.',
    apiModalStep3: 'Pégala a continuación. Se guarda únicamente en el localStorage de tu navegador.',
    apiModalKeyLabel: 'Clave API Twelve Data:',
    apiModalSave: 'Guardar y Aplicar Clave',
    apiModalRemove: 'Eliminar Clave',
    apiModalClose: 'Cerrar',
  },
};
