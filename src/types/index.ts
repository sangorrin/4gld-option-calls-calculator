export interface Candle {
  datetime: string; // YYYY-MM-DD
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type AlgorithmType = 'cava' | 'quant_delta';

export type TrafficLightStatus = 'green' | 'yellow' | 'red';

export interface TrafficLightResult {
  status: TrafficLightStatus;
  headline: string;
  reason: string;
  rsi: number;
  priceVsSma20Pct: number;
  volatilityRank: 'High' | 'Normal' | 'Low';
}

export interface RecommendationResult {
  algorithm: AlgorithmType;
  algorithmName: string;
  analysisDate: string;
  spotPrice: number;
  sma20: number;
  sma50: number;
  regime: 'Bullish' | 'Neutral / Sideways' | 'Bearish / Corrective';
  r1Resistance: number;
  r2Resistance: number;
  recommendedDTE: number;
  recommendedExpiryDate: string;
  recommendedStrike: number;
  strikeBufferPct: number;
  estimatedDelta: number;
  historicalVolatilityPct: number;
  winProbabilityPct: number;
  estimatedPremiumPerShare: number;
  estimatedTotalCash: number; // for 100 shares
  annualizedYieldPct: number;
  downsideBufferPct: number;
  reasoning: string[];
  trafficLight: TrafficLightResult;
  freedom24Instructions: {
    ticker: string;
    action: string;
    expiration: string;
    strike: string;
    contracts: number;
    sharesRequired: number;
    orderType: string;
    summary: string;
  };
}

export interface BacktestOutcome {
  testDate: string;
  initialSpot: number;
  algorithm: AlgorithmType;
  recommendedExpiryDate: string;
  recommendedStrike: number;
  recommendedDTE: number;
  estimatedPremiumCollected: number; // for 1 contract (100 shares)
  finalSpotAtExpiry: number;
  maxSpotReached: number;
  isBreached: boolean;
  isAssigned: boolean;
  totalPnLEuro: number;
  capitalGainEuro: number;
  premiumEuro: number;
  outcomeType: 'EXPIRED_WORTHLESS' | 'ASSIGNED_PROFIT' | 'ASSIGNED_CAPPED';
  headline: string;
  investorStory: string;
  pathCandles: Candle[];
}
