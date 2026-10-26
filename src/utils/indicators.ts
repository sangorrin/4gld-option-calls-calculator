import {
  Candle,
  AlgorithmType,
  RecommendationResult,
  TrafficLightResult,
  BacktestOutcome,
} from '../types';

/**
 * Standard Normal Cumulative Distribution Function Φ(x)
 * Accurate Abramowitz & Stegun polynomial approximation.
 */
export function normalCDF(x: number): number {
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.3989422804014327; // 1 / sqrt(2 * PI)

  if (x >= 0.0) {
    const t = 1.0 / (1.0 + p * x);
    return 1.0 - c * Math.exp((-x * x) / 2.0) * t * (t * (t * (t * (b5 * t + b4) + b3) + b2) + b1);
  } else {
    const t = 1.0 / (1.0 - p * x);
    return c * Math.exp((-x * x) / 2.0) * t * (t * (t * (t * (b5 * t + b4) + b3) + b2) + b1);
  }
}

/**
 * Inverse Normal CDF (quantile function)
 * Rational approximation for finding z-score given probability p.
 */
export function inverseNormalCDF(p: number): number {
  if (p <= 0 || p >= 1) {
    throw new Error('Probability p must be between 0 and 1');
  }
  // Beasley-Springer-Moro algorithm
  const a = [
    2.50662823884,
    -18.61500062529,
    41.39119773534,
    -25.44106049637,
  ];
  const b = [
    -8.47351093090,
    23.08336743743,
    -21.06224101826,
    3.13082909833,
  ];
  const c = [
    0.3374754822726147,
    0.9761690190917186,
    0.1607979714918209,
    0.0276438810338635,
    0.0038405729373609,
    0.0003951804142957,
    0.0000321767881768,
    0.0000002888167364,
    0.0000003960315187,
  ];

  const y = p - 0.5;
  if (Math.abs(y) < 0.42) {
    const r = y * y;
    return (
      (y * (((a[3] * r + a[2]) * r + a[1]) * r + a[0])) /
      ((((b[3] * r + b[2]) * r + b[1]) * r + b[0]) * r + 1.0)
    );
  }

  let r = p;
  if (y > 0) {
    r = 1.0 - p;
  }
  r = Math.log(-Math.log(r));
  let x =
    c[0] +
    r *
      (c[1] +
        r *
          (c[2] +
            r *
              (c[3] +
                r *
                  (c[4] +
                    r *
                      (c[5] +
                        r * (c[6] + r * (c[7] + r * c[8])))))));
  if (y < 0) {
    x = -x;
  }
  return x;
}

/**
 * Calculate Simple Moving Average
 */
export function calculateSMA(candles: Candle[], period: number): number {
  if (candles.length < period) {
    const sum = candles.reduce((acc, c) => acc + c.close, 0);
    return sum / candles.length;
  }
  const slice = candles.slice(-period);
  const sum = slice.reduce((acc, c) => acc + c.close, 0);
  return Number((sum / period).toFixed(2));
}

/**
 * Calculate 14-period RSI
 */
export function calculateRSI(candles: Candle[], period: number = 14): number {
  if (candles.length <= period) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = candles.length - period; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) {
      gains += diff;
    } else {
      losses += Math.abs(diff);
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);
  return Number(rsi.toFixed(1));
}

/**
 * Historical Annualized Volatility (30 days)
 */
export function calculateHistoricalVolatility(candles: Candle[], period: number = 30): number {
  const lookback = Math.min(candles.length - 1, period);
  if (lookback < 5) return 0.14; // baseline gold HV ~14%

  const returns: number[] = [];
  const startIdx = candles.length - lookback;

  for (let i = startIdx; i < candles.length; i++) {
    const prev = candles[i - 1].close;
    const curr = candles[i].close;
    returns.push(Math.log(curr / prev));
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const dailyStd = Math.sqrt(variance);
  const annualized = dailyStd * Math.sqrt(252);

  // Reasonable bounds for gold HV (between 9% and 35%)
  const clamped = Math.max(0.09, Math.min(annualized, 0.35));
  return Number(clamped.toFixed(4));
}

/**
 * Detect Swing-High Resistance levels (R1, R2)
 */
export function detectResistanceLevels(
  candles: Candle[],
  currentSpot: number
): { r1: number; r2: number; isAllTimeHigh: boolean } {
  const windowSize = Math.min(candles.length, 60);
  const recent = candles.slice(-windowSize);

  const swingHighs: number[] = [];

  for (let i = 2; i < recent.length - 2; i++) {
    const h = recent[i].high;
    if (
      h >= recent[i - 1].high &&
      h >= recent[i - 2].high &&
      h >= recent[i + 1].high &&
      h >= recent[i + 2].high
    ) {
      swingHighs.push(h);
    }
  }

  // Filter swing highs strictly above current spot price
  const above = swingHighs.filter((h) => h > currentSpot).sort((a, b) => a - b);

  if (above.length >= 2) {
    return {
      r1: Number(above[0].toFixed(2)),
      r2: Number(above[above.length - 1].toFixed(2)),
      isAllTimeHigh: false,
    };
  } else if (above.length === 1) {
    const r1 = above[0];
    const r2 = Number((r1 * 1.025).toFixed(2));
    return { r1: Number(r1.toFixed(2)), r2, isAllTimeHigh: false };
  } else {
    // Current price is at or near recent high (All-time or local high)
    // Project dynamic resistance based on volatility bands (+2.0% and +4.0%)
    const r1 = Number((currentSpot * 1.02).toFixed(2));
    const r2 = Number((currentSpot * 1.045).toFixed(2));
    return { r1, r2, isAllTimeHigh: true };
  }
}

/**
 * Black-Scholes European Call Price & Delta
 */
export function calculateBlackScholesCall(
  S: number, // Spot price
  K: number, // Strike
  T: number, // Years (DTE / 365)
  r: number = 0.0325, // ECB risk-free rate ~3.25%
  sigma: number = 0.14 // Annualized Volatility
): { price: number; delta: number; probOtmPct: number } {
  if (T <= 0) {
    const intrinsic = Math.max(0, S - K);
    return {
      price: intrinsic,
      delta: S > K ? 1.0 : 0.0,
      probOtmPct: S < K ? 100 : 0,
    };
  }

  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const N_d1 = normalCDF(d1);
  const N_d2 = normalCDF(d2);

  const callPrice = S * N_d1 - K * Math.exp(-r * T) * N_d2;
  const delta = Number(Math.max(0.01, Math.min(0.99, N_d1)).toFixed(2));
  const probOtm = Number(((1 - N_d2) * 100).toFixed(1));

  // Minimum floor premium for deep OTM
  const clampedPrice = Math.max(0.15, Number(callPrice.toFixed(2)));

  return {
    price: clampedPrice,
    delta,
    probOtmPct: Math.max(50, Math.min(98, probOtm)),
  };
}

/**
 * Round strike to clean standard option trading intervals (e.g. €0.50 or €1.00)
 */
export function roundToStandardStrike(strike: number): number {
  if (strike > 80) {
    // Round up to nearest whole euro or half-euro
    return Math.ceil(strike * 2) / 2;
  }
  return Math.ceil(strike);
}

/**
 * Traffic Light Condition Evaluator
 */
export function evaluateTrafficLight(
  candles: Candle[],
  spot: number,
  sma20: number,
  hv: number
): TrafficLightResult {
  const rsi = calculateRSI(candles);
  const priceVsSma20Pct = Number((((spot - sma20) / sma20) * 100).toFixed(1));
  const volatilityRank: 'High' | 'Normal' | 'Low' =
    hv > 0.18 ? 'High' : hv < 0.12 ? 'Low' : 'Normal';

  // 🔴 Red Caution Condition:
  // Extreme oversold panic (RSI < 35) or price collapsed > 3.5% below SMA 20
  if (rsi < 35 || priceVsSma20Pct < -3.5) {
    return {
      status: 'red',
      headline: 'Caution / Wait (Red Light)',
      reason:
        'Market is temporarily oversold after a sharp drop. Selling a call right now locks in depressed prices and yields low premium. Wait for a green bounce before writing calls.',
      rsi,
      priceVsSma20Pct,
      volatilityRank,
    };
  }

  // 🟢 Green Favorable Condition:
  // Overbought extension (RSI > 65), extended > 2% above SMA 20, or High Volatility regime
  if (rsi > 64 || priceVsSma20Pct > 2.2 || (volatilityRank === 'High' && priceVsSma20Pct >= 0)) {
    return {
      status: 'green',
      headline: 'Favorable Moment (Green Light)',
      reason:
        'Gold is riding high near resistance and options implied volatility is juicy. Selling calls here captures peak cash premium while the statistical probability of stalling is high.',
      rsi,
      priceVsSma20Pct,
      volatilityRank,
    };
  }

  // 🟡 Yellow Neutral Condition:
  return {
    status: 'yellow',
    headline: 'Neutral Market (Yellow Light)',
    reason:
      'Standard market conditions. Gold is trading in orderly equilibrium. Stick to the chosen algorithmic strike rules and maintain your 100-share coverage.',
    rsi,
    priceVsSma20Pct,
    volatilityRank,
  };
}

/**
 * Add days to YYYY-MM-DD date and format as standard ISO string
 */
export function addDaysToDate(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

/**
 * Run Analysis Engine for either Algorithm 1 (Cava) or Algorithm 2 (Quant Delta)
 */
export function analyzeMarket(
  candles: Candle[],
  algorithm: AlgorithmType = 'cava'
): RecommendationResult {
  if (candles.length < 20) {
    throw new Error('Need at least 20 daily candles for analysis');
  }

  const latest = candles[candles.length - 1];
  const spotPrice = latest.close;
  const analysisDate = latest.datetime;

  const sma20 = calculateSMA(candles, 20);
  const sma50 = calculateSMA(candles, 50);
  const hv = calculateHistoricalVolatility(candles, 30);
  const trafficLight = evaluateTrafficLight(candles, spotPrice, sma20, hv);
  const { r1, r2, isAllTimeHigh } = detectResistanceLevels(candles, spotPrice);

  let regime: 'Bullish' | 'Neutral / Sideways' | 'Bearish / Corrective' = 'Neutral / Sideways';
  if (spotPrice >= sma20 && sma20 >= sma50) {
    regime = 'Bullish';
  } else if (spotPrice < sma20 && spotPrice < sma50) {
    regime = 'Bearish / Corrective';
  } else {
    regime = 'Neutral / Sideways';
  }

  let recommendedDTE = 30;
  let rawStrike = spotPrice;
  const reasoning: string[] = [];

  if (algorithm === 'cava') {
    // José Luis Cava Model:
    // Bullish -> 15 DTE, Strike placed above R1 resistance (or swing high + buffer) to avoid early assignment
    // Neutral / Bearish -> 30 DTE, Strike placed above R2 resistance for maximum time decay premium
    if (regime === 'Bullish') {
      recommendedDTE = 15;
      const targetResistance = Math.max(r1, Number((spotPrice * 1.025).toFixed(2)));
      rawStrike = targetResistance;
      reasoning.push(
        'Bullish Regime detected (Spot > SMA20 > SMA50). Gold has strong upward velocity.'
      );
      reasoning.push(
        'Targeting 15 DTE (short duration) to prevent premature share assignment during the rally.'
      );
      reasoning.push(
        `Selected Strike placed above key Resistance R1 (€${r1}${isAllTimeHigh ? ' [ATH extension]' : ''}) with buffer to capture high annualized yield while letting gold run.`
      );
    } else if (regime === 'Neutral / Sideways') {
      recommendedDTE = 30;
      const targetResistance = Math.max(r2, Number((spotPrice * 1.035).toFixed(2)));
      rawStrike = targetResistance;
      reasoning.push('Neutral / Sideways Regime detected. Market is rangebound between support and resistance.');
      reasoning.push(
        'Targeting 30 DTE to ride the steep theta decay curve and maximize cash flow.'
      );
      reasoning.push(
        `Selected Strike placed safely above major swing Resistance R2 (€${r2}) where sellers historically step in.`
      );
    } else {
      // Bearish / Corrective
      recommendedDTE = 30;
      const target = Math.max(sma50, Number((spotPrice * 1.03).toFixed(2)));
      rawStrike = target;
      reasoning.push('Bearish / Corrective Regime detected (Spot below SMA20/50).');
      reasoning.push(
        'Targeting 30 DTE with strike anchored above the 50-day moving average barrier.'
      );
      if (trafficLight.status === 'red') {
        reasoning.push(
          'Traffic light is RED: Exercise patience before submitting order to avoid selling the bottom.'
        );
      }
    }
  } else {
    // Quantitative Delta / Probability Model:
    // Mathematical selection aiming for Delta ~ 0.16 (approx 1 standard deviation OTM, ~84% win rate)
    recommendedDTE = 30;
    const T = recommendedDTE / 365;
    const r = 0.0325; // Risk free rate
    // Target Delta 0.16 corresponds to N(d1) = 0.16 -> d1 approx -0.994
    // Using inverse normal of 0.16: z = -0.994
    // d1 = (ln(S/K) + (r + 0.5*sigma^2)*T) / (sigma*sqrt(T)) = -0.994
    // => ln(S/K) = -0.994 * sigma * sqrt(T) - (r + 0.5*sigma^2)*T
    // => K = S * exp(0.994 * sigma * sqrt(T) + (r + 0.5*sigma^2)*T)
    const zTarget = 0.994; // approx 1 standard deviation out of the money
    const exponent = zTarget * hv * Math.sqrt(T) + (r + 0.5 * hv * hv) * T;
    rawStrike = spotPrice * Math.exp(exponent);

    reasoning.push(
      `Quantitative Delta Model: Current Annualized Volatility is ${(hv * 100).toFixed(1)}%.`
    );
    reasoning.push(
      'Targeting ~0.16 Delta (1 Standard Deviation OTM) over a 30-day expiration window.'
    );
    reasoning.push(
      'Statistically yields an ~84% probability of expiring completely out-of-the-money (keeping 100% of cash premium).'
    );
  }

  const recommendedStrike = roundToStandardStrike(rawStrike);
  const recommendedExpiryDate = addDaysToDate(analysisDate, recommendedDTE);
  const strikeBufferPct = Number((((recommendedStrike - spotPrice) / spotPrice) * 100).toFixed(1));

  // Option calculations
  const T = recommendedDTE / 365;
  const bs = calculateBlackScholesCall(spotPrice, recommendedStrike, T, 0.0325, hv);
  const estimatedPremiumPerShare = bs.price;
  const estimatedTotalCash = Number((estimatedPremiumPerShare * 100).toFixed(2));
  const annualizedYieldPct = Number(
    (((estimatedPremiumPerShare / spotPrice) * (365 / recommendedDTE)) * 100).toFixed(1)
  );
  const downsideBufferPct = Number(((estimatedPremiumPerShare / spotPrice) * 100).toFixed(1));

  return {
    algorithm,
    algorithmName:
      algorithm === 'cava'
        ? 'José Luis Cava Model (Trend & Resistance)'
        : 'Quantitative Delta / Probability Model (~0.16 Delta)',
    analysisDate,
    spotPrice,
    sma20,
    sma50,
    regime,
    r1Resistance: r1,
    r2Resistance: r2,
    recommendedDTE,
    recommendedExpiryDate,
    recommendedStrike,
    strikeBufferPct,
    estimatedDelta: bs.delta,
    historicalVolatilityPct: Number((hv * 100).toFixed(1)),
    winProbabilityPct: bs.probOtmPct,
    estimatedPremiumPerShare,
    estimatedTotalCash,
    annualizedYieldPct,
    downsideBufferPct,
    reasoning,
    trafficLight,
    freedom24Instructions: {
      ticker: '4GLD (ISIN: DE000A0S9GB0, Deutsche Börse Xetra)',
      action: 'Sell to Open (Call Option)',
      expiration: recommendedExpiryDate,
      strike: `€${recommendedStrike.toFixed(2)}`,
      contracts: 1,
      sharesRequired: 100,
      orderType: 'Limit Order (Midpoint of Bid/Ask)',
      summary: `Open Freedom24 -> Search 4GLD -> Options tab -> Select expiry date ~${recommendedExpiryDate} -> Choose Strike ≥ €${recommendedStrike.toFixed(
        2
      )} -> Click 'Sell to Open' 1 Contract -> Keep ~€${estimatedTotalCash.toFixed(0)} cash instantly!`,
    },
  };
}

/**
 * Run Historical Backtest
 * Slices data up to testDate, computes recommendation, then steps forward to expiration.
 */
export function runBacktest(
  allCandles: Candle[],
  testDate: string,
  algorithm: AlgorithmType
): BacktestOutcome {
  const testIndex = allCandles.findIndex((c) => c.datetime === testDate);
  if (testIndex < 25) {
    throw new Error('Selected date does not have sufficient preceding data (need at least 25 candles).');
  }

  // Slice historical data strictly UP TO the test date (NO LOOKAHEAD)
  const slicedCandles = allCandles.slice(0, testIndex + 1);
  const recommendation = analyzeMarket(slicedCandles, algorithm);

  const initialSpot = recommendation.spotPrice;
  const strike = recommendation.recommendedStrike;
  const dte = recommendation.recommendedDTE;
  const premiumCollected = recommendation.estimatedTotalCash;

  // Now inspect the future data after the test date
  const futureCandles = allCandles.slice(testIndex + 1);

  // Approximate trading days for DTE (15 DTE ~ 10-11 trading days, 30 DTE ~ 21-22 trading days)
  const tradingDays = Math.min(
    futureCandles.length,
    Math.round(dte * (5 / 7))
  );

  const windowCandles = futureCandles.slice(0, Math.max(1, tradingDays));
  const pathCandles = [allCandles[testIndex], ...windowCandles];

  let maxSpot = initialSpot;
  let finalSpot = initialSpot;

  for (const c of windowCandles) {
    if (c.high > maxSpot) maxSpot = c.high;
    finalSpot = c.close;
  }

  const isBreached = maxSpot >= strike;
  const isAssigned = finalSpot >= strike;

  // Financial outcomes
  let outcomeType: 'EXPIRED_WORTHLESS' | 'ASSIGNED_PROFIT' | 'ASSIGNED_CAPPED';
  let capitalGainEuro = 0;
  let totalPnLEuro = 0;
  let headline = '';
  let investorStory = '';

  if (!isAssigned) {
    outcomeType = 'EXPIRED_WORTHLESS';
    capitalGainEuro = Number(((finalSpot - initialSpot) * 100).toFixed(2));
    totalPnLEuro = Number((premiumCollected + capitalGainEuro).toFixed(2));
    headline = '100% Cash Rental Retained + Kept All Gold Shares';
    investorStory = `Gold never closed above your strike of €${strike.toFixed(
      2
    )} (it closed at €${finalSpot.toFixed(
      2
    )} on expiration). The call option expired worthless. You pocketed the full €${premiumCollected.toFixed(
      2
    )} cash premium immediately, and you still own your 100 shares of 4GLD gold in full!`;
  } else {
    // Assigned: Shares were called away at strike price
    capitalGainEuro = Number(((strike - initialSpot) * 100).toFixed(2));
    totalPnLEuro = Number((premiumCollected + capitalGainEuro).toFixed(2));
    const missedUpside = Number(((finalSpot - strike) * 100).toFixed(2));

    if (strike > initialSpot) {
      outcomeType = 'ASSIGNED_PROFIT';
      headline = 'Max Profit Achieved: Premium Kept + Gold Sold at a Profit';
      investorStory = `Gold surged past your strike of €${strike.toFixed(
        2
      )} up to €${finalSpot.toFixed(
        2
      )}. Your 100 shares were sold as agreed at €${strike.toFixed(
        2
      )}. You kept 100% of the €${premiumCollected.toFixed(
        2
      )} cash premium PLUS earned €${capitalGainEuro.toFixed(
        2
      )} in gold capital gains (total profit: €${totalPnLEuro.toFixed(
        2
      )}). Note: You missed the additional upside of €${missedUpside.toFixed(
        2
      )} above the strike price.`;
    } else {
      outcomeType = 'ASSIGNED_CAPPED';
      headline = 'Shares Assigned at Strike Price';
      investorStory = `Gold finished at €${finalSpot.toFixed(
        2
      )}, above your strike of €${strike.toFixed(
        2
      )}. Your 100 shares were sold at €${strike.toFixed(
        2
      )}. Your total net P&L was €${totalPnLEuro.toFixed(
        2
      )} (including €${premiumCollected.toFixed(2)} cash premium).`;
    }
  }

  return {
    testDate,
    initialSpot,
    algorithm,
    recommendedExpiryDate: recommendation.recommendedExpiryDate,
    recommendedStrike: strike,
    recommendedDTE: dte,
    estimatedPremiumCollected: premiumCollected,
    finalSpotAtExpiry: finalSpot,
    maxSpotReached: maxSpot,
    isBreached,
    isAssigned,
    totalPnLEuro,
    capitalGainEuro,
    premiumEuro: premiumCollected,
    outcomeType,
    headline,
    investorStory,
    pathCandles,
  };
}
