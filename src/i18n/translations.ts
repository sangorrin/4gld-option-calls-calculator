export type Language = 'en' | 'es';

export const translations = {
  en: {
    appTitle: 'GoldRent Assistant',
    appBadge: '4GLD',
    appSubtitle: 'Automated Covered Call strategy planner & backtester for Xetra-Gold',
    description: 'Educational platform for studying physical gold covered call options and mathematical strike models.',
    marketInfo: 'Market: Deutsche Börse Xetra (Frankfurt) · ISIN: DE000A0S9GB0 · 1 Share = 1g Pure Gold',
    dataSourceLive: 'Twelve Data Live REST',
    dataSourceVerified: 'Verified Frankfurt Feed',
    freedomReady: 'Freedom24 Ready',
    refresh: 'Refresh Analysis',
    twelveDataActive: 'Twelve Data: Active',
    twelveDataConfig: 'Twelve Data API',
    
    // Disclaimer
    disclaimerTitle: 'Regulatory & Educational Disclaimer',
    disclaimerText:
      'Disclaimer: This software is for educational and informational purposes only and does not constitute financial, investment, or trading advice. Options trading involves substantial risk of loss and is not suitable for every investor. The author accepts no liability for any financial losses incurred from using this tool or its models.',
    
    // Educational Overview
    overviewTitle: 'Educational Framework: Transforming Gold ETF into Recurring Cash Yield',
    overviewSubtitle: 'An academic and mathematical exploration of Covered Call mechanics on Frankfurt Xetra-Gold (4GLD)',
    overviewP1:
      'This educational web tool demonstrates how systematic quantitative and technical algorithms can determine option strike prices and optimal expiration horizons for physical gold exchange-traded commodities. By pairing 100 shares of 4GLD (100 grams of allocated physical gold in Frankfurt vaults) with the sale of an out-of-the-money call option, an investor models how an otherwise non-yielding precious metal can generate regular "rental income" without incurring naked, unlimited downside risk.',
    overviewP2:
      'Important: This application is strictly an educational research and calculation tool designed to model financial engineering concepts. It is not an automated robo-advisor, brokerage service, or solicitation to execute trades. The mathematical models are presented transparently to help students, analysts, and self-directed investors understand how moving average regimes, swing-high resistances, and Black-Scholes standard deviations interact.',
    overviewCard1Title: 'Zero Unlimited Risk (Covered Rule)',
    overviewCard1Desc: 'By strictly owning 100 shares of 4GLD prior to selling 1 contract, upside is capped at the strike price, but you never owe out-of-pocket cash.',
    overviewCard2Title: 'Dual Mathematical Models',
    overviewCard2Desc: 'Compare José Luis Cava’s trend & resistance methodology with Black-Scholes Gaussian ~0.16 Delta (~84% probability) volatility boundaries.',
    overviewCard3Title: 'Deterministic Algorithms',
    overviewCard3Desc: 'No black-box machine learning or speculative calls. 100% reproducible statistical calculations based on actual market price distributions.',

    // Live Dashboard
    liveDashboardTitle: 'Live Execution Dashboard',
    liveDashboardSubtitle: 'Weekly automated Covered Call action recommendations for 4GLD. Both strategies are displayed side-by-side.',
    currentSpot: 'Spot Price (1g Gold)',
    regimeBullish: 'Bullish Regime',
    regimeNeutral: 'Neutral / Sideways Regime',
    regimeBearish: 'Bearish / Corrective Regime',
    chartTimeframe: 'Chart Lookback:',
    chartDays30: '30 Days',
    chartDays60: '60 Days (Default)',
    chartDays90: '90 Days',
    chartDays180: '180 Days',
    
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

    // Pine Script Section
    pineTitle: 'TradingView Pine Script (Custom 4GLD Indicator)',
    pineSubtitle: 'Official Pine Script v5 script to plot moving averages, dynamic resistances, and 0.16 Delta ceilings directly on your TradingView charts.',
    pineCopyBtn: 'Copy Pine Script',
    pineCopiedBtn: 'Pine Script Copied!',
    pineInstallTitle: 'Step-by-Step Instructions to Install It',
    pineStep1: 'Open TradingView and navigate to the 4GLD chart (or XETR:4GLD).',
    pineStep2: 'At the very bottom bar of your screen, click on Pine Editor.',
    pineStep3: 'Select and delete any default placeholder code inside the editor.',
    pineStep4: 'Paste the entire code block into the editor.',
    pineStep5: 'Click Save (name it "4GLD Covered Call Assistant").',
    pineStep6: 'Click Add to chart.',
    pineChartLegendTitle: 'What You Will See on Your Chart:',
    pineLegend1: 'Yellow & Blue Curves: The 20 and 50 daily Simple Moving Averages.',
    pineLegend2: 'Orange & Red Dashed Lines: The current resistance levels (R1 and R2) derived from pivot swing highs.',
    pineLegend3: 'Dotted Purple Line: The statistical 0.16 Delta volatility ceiling projected over 35 days.',
    pineLegend4: 'Dashboard Table (Top Right): Displays the market regime (Bullish/Sideways/Bearish), spot price, volatility, and exact recommended strike floors and DTE for both models.',
    
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
    description: 'Plataforma educativa para estudiar la operativa de covered calls y modelos matemáticos de strike sobre oro físico.',
    marketInfo: 'Mercado: Deutsche Börse Xetra (Fráncfort) · ISIN: DE000A0S9GB0 · 1 Acción = 1g de Oro Puro',
    dataSourceLive: 'Twelve Data Live REST',
    dataSourceVerified: 'Datos Verificados Xetra Fráncfort',
    freedomReady: 'Listo para Freedom24',
    refresh: 'Actualizar Análisis',
    twelveDataActive: 'Twelve Data: Activo',
    twelveDataConfig: 'API Twelve Data',
    
    // Disclaimer
    disclaimerTitle: 'Aviso Legal y Educativo',
    disclaimerText:
      'Disclaimer: This software is for educational and informational purposes only and does not constitute financial, investment, or trading advice. Options trading involves substantial risk of loss and is not suitable for every investor. The author accepts no liability for any financial losses incurred from using this tool or its models. (Descargo de responsabilidad: Este software tiene fines educativos e informativos únicamente y no constituye asesoramiento financiero, de inversión ni de negociación. La operativa con opciones conlleva un riesgo sustancial de pérdida y no es adecuada para todos los inversores. El autor no asume responsabilidad alguna por las pérdidas financieras derivadas del uso de esta herramienta o de sus modelos.)',
    
    // Educational Overview
    overviewTitle: 'Marco Educativo: Transformando el Oro ETF en Renta Periódica',
    overviewSubtitle: 'Exploración académica y matemática de la estrategia Covered Call sobre Xetra-Gold (4GLD)',
    overviewP1:
      'Esta herramienta web educativa tiene como propósito demostrar cómo modelos cuantitativos y técnicos determinan de forma sistemática el precio de ejercicio (Strike) y el horizonte temporal óptimo de vencimiento para commodities de oro físico cotizado. Al combinar 100 acciones de 4GLD (100 gramos de oro físico asignado en cámaras acorazadas de Fráncfort) con la venta de una opción Call fuera del dinero, se ilustra cómo un activo que por sí mismo no genera dividendos puede transformarse en un flujo recurrente de renta en efectivo sin asumir riesgo ilimitado.',
    overviewP2:
      'Aviso importante: Esta aplicación es estrictamente una herramienta de investigación y cálculo educativo para modelar conceptos de ingeniería financiera. No constituye un gestor automatizado, servicio de intermediación ni recomendación de inversión. Los modelos matemáticos se presentan con total transparencia para que estudiantes, analistas e inversores comprendan la interacción entre regímenes de medias móviles, resistencias por máximos relativos y la desviación estándar de Black-Scholes.',
    overviewCard1Title: 'Riesgo Ilimitado Nulo (Regla Covered)',
    overviewCard1Desc: 'Al poseer estrictamente 100 acciones de 4GLD antes de vender 1 contrato, el beneficio alcista queda acotado en el strike, pero jamás adeudas efectivo.',
    overviewCard2Title: 'Modelos Matemáticos Duales',
    overviewCard2Desc: 'Compara la metodología de tendencia y resistencia de José Luis Cava con los límites de volatilidad gaussiana a ~0.16 Delta (~84% probabilidad).',
    overviewCard3Title: 'Algoritmos Deterministas',
    overviewCard3Desc: 'Sin cajas negras ni conjeturas. Cálculos estadísticos 100% reproducibles y basados en la distribución real de precios del mercado.',

    // Live Dashboard
    liveDashboardTitle: 'Panel de Ejecución en Vivo',
    liveDashboardSubtitle: 'Recomendaciones semanales automáticas de Covered Call para 4GLD. Ambos modelos se muestran simultáneamente.',
    currentSpot: 'Precio Spot (1g de Oro)',
    regimeBullish: 'Régimen Alcista',
    regimeNeutral: 'Régimen Lateral / Neutro',
    regimeBearish: 'Régimen Bajista / Correctivo',
    chartTimeframe: 'Histórico del Gráfico:',
    chartDays30: '30 Días',
    chartDays60: '60 Días (Predeterminado)',
    chartDays90: '90 Días',
    chartDays180: '180 Días',
    
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

    // Pine Script Section
    pineTitle: 'Pine Script para TradingView (Indicador Oficial 4GLD)',
    pineSubtitle: 'Código Pine Script v5 para trazar medias móviles, resistencias dinámicas y el techo de 0.16 Delta directamente en tus gráficos de TradingView.',
    pineCopyBtn: 'Copiar Código Pine Script',
    pineCopiedBtn: '¡Pine Script Copiado!',
    pineInstallTitle: 'Instrucciones Paso a Paso para Instalarlo',
    pineStep1: 'Abre TradingView y accede al gráfico de 4GLD (o XETR:4GLD).',
    pineStep2: 'En la barra inferior de tu pantalla, haz clic en "Editor de Pine" (Pine Editor).',
    pineStep3: 'Selecciona y borra cualquier código de plantilla que haya dentro del editor.',
    pineStep4: 'Pega todo el bloque de código que aparece a continuación.',
    pineStep5: 'Haz clic en Guardar (puedes nombrarlo "4GLD Covered Call Assistant").',
    pineStep6: 'Haz clic en "Añadir al gráfico" (Add to chart).',
    pineChartLegendTitle: 'Qué Verás en tu Gráfico:',
    pineLegend1: 'Curvas Amarilla y Azul: Las Medias Móviles Simples (SMA) diarias de 20 y 50 periodos.',
    pineLegend2: 'Líneas Discontinuas Naranja y Roja: Los niveles de resistencia actuales (R1 y R2) calculados a partir de los máximos pivot.',
    pineLegend3: 'Línea de Puntos Fucsia: El techo estadístico de volatilidad a 0.16 Delta proyectado a 35 días.',
    pineLegend4: 'Tabla Panel de Control (Arriba a la Derecha): Muestra el régimen de mercado (Alcista/Lateral/Bajista), precio spot, volatilidad y los strikes y DTE recomendados para ambos modelos.',
    
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
