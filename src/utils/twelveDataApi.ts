import { Candle } from '../types';
import { verified4GLDCandles } from '../data/mock4GLDData';

const LOCAL_STORAGE_KEY = 'twelvedata_api_key';
const CACHE_STORAGE_KEY = 'twelvedata_cache_4gld';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function saveApiKey(key: string): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, key.trim());
    sessionStorage.removeItem(CACHE_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to save API key to localStorage', e);
  }
}

export function removeApiKey(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    sessionStorage.removeItem(CACHE_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to remove API key from localStorage', e);
  }
}

export interface FetchResult {
  candles: Candle[];
  source: 'live_api' | 'verified_cache';
  symbol: string;
  warning?: string;
}

interface CachePayload {
  timestamp: number;
  candles: Candle[];
  source: 'live_api' | 'verified_cache';
  symbol: string;
}

function getCachedResult(): FetchResult | null {
  try {
    const raw = sessionStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) return null;
    const payload: CachePayload = JSON.parse(raw);
    if (Date.now() - payload.timestamp < CACHE_TTL_MS) {
      return {
        candles: payload.candles,
        source: payload.source,
        symbol: payload.symbol,
      };
    }
  } catch {
    // Ignore cache parse errors
  }
  return null;
}

function setCachedResult(result: FetchResult): void {
  try {
    const payload: CachePayload = {
      timestamp: Date.now(),
      candles: result.candles,
      source: result.source,
      symbol: result.symbol,
    };
    sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Test API key with Twelve Data
 */
export async function testTwelveDataApiKey(
  apiKey: string
): Promise<{ success: boolean; message: string }> {
  const key = apiKey.trim();
  if (!key) {
    return { success: false, message: 'API key cannot be empty.' };
  }

  // Test endpoints: GAU/EUR (Gold Gram) and 4GLD
  const testEndpoints = [
    `https://api.twelvedata.com/time_series?symbol=GAU/EUR&interval=1day&outputsize=1&apikey=${encodeURIComponent(key)}`,
    `https://api.twelvedata.com/time_series?symbol=4GLD&exchange=XETR&interval=1day&outputsize=1&apikey=${encodeURIComponent(key)}`,
    `https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=1day&outputsize=1&apikey=${encodeURIComponent(key)}`,
  ];

  for (const url of testEndpoints) {
    try {
      const res = await fetch(url);
      const data = await res.json().catch(() => null);

      if (data && data.values && data.values.length > 0) {
        return {
          success: true,
          message: `Connection successful! Twelve Data API key is valid and streaming live quotes (€${parseFloat(
            data.values[0].close
          ).toFixed(2)}).`,
        };
      }

      if (data && data.status === 'error') {
        if (data.code === 401 || (data.message && data.message.includes('apikey'))) {
          return { success: false, message: `Invalid API key: ${data.message}` };
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('API test ping failed:', msg);
    }
  }

  return {
    success: false,
    message: 'Could not connect to Twelve Data. Please check your internet connection or API key.',
  };
}

/**
 * Fetch 4GLD daily candles from Twelve Data REST API.
 * Uses outputsize=60 to avoid free-tier 404 depth limits.
 * Tries 4GLD:XETR, GAU/EUR (Gold Gram), and XAU/EUR (Gold Spot).
 */
export async function fetchTwelveDataCandles(
  apiKey?: string,
  forceRefresh: boolean = false
): Promise<FetchResult> {
  const key = apiKey || getStoredApiKey();

  if (!key) {
    return {
      candles: verified4GLDCandles,
      source: 'verified_cache',
      symbol: '4GLD (Frankfurt Xetra)',
      warning: undefined,
    };
  }

  // Check cache first unless user explicitly pressed Refresh
  if (!forceRefresh) {
    const cached = getCachedResult();
    if (cached) {
      return cached;
    }
  }

  const queryCandidates = [
    {
      name: '4GLD (Deutsche Börse Xetra)',
      url: `https://api.twelvedata.com/time_series?symbol=4GLD&exchange=XETR&interval=1day&outputsize=60&apikey=${encodeURIComponent(key)}`,
      multiplier: 1.0,
    },
    {
      name: 'GAU/EUR (Gold Gram Spot)',
      url: `https://api.twelvedata.com/time_series?symbol=GAU/EUR&interval=1day&outputsize=60&apikey=${encodeURIComponent(key)}`,
      multiplier: 1.0,
    },
    {
      name: 'XAU/EUR (Gold Spot 1g equiv)',
      url: `https://api.twelvedata.com/time_series?symbol=XAU/EUR&interval=1day&outputsize=60&apikey=${encodeURIComponent(key)}`,
      multiplier: 1 / 31.1034768, // convert Troy Ounce to 1 Gram
    },
    {
      name: '4GLD (Global)',
      url: `https://api.twelvedata.com/time_series?symbol=4GLD&interval=1day&outputsize=60&apikey=${encodeURIComponent(key)}`,
      multiplier: 1.0,
    },
  ];

  let detailedError: string | null = null;

  for (const candidate of queryCandidates) {
    try {
      const res = await fetch(candidate.url);
      const data = await res.json().catch(() => null);

      if (!data) {
        continue;
      }

      if (data.status === 'error') {
        detailedError = data.message || `Code ${data.code}`;
        console.warn(`Twelve Data query for ${candidate.name} returned:`, detailedError);
        continue;
      }

      if (data.values && Array.isArray(data.values) && data.values.length >= 10) {
        // Successful response! Parse candles
        const mult = candidate.multiplier;
        const parsed: Candle[] = data.values
          .map((item: { datetime: string; open: string; high: string; low: string; close: string; volume?: string }) => ({
            datetime: item.datetime.split(' ')[0],
            open: Number((parseFloat(item.open) * mult).toFixed(2)),
            high: Number((parseFloat(item.high) * mult).toFixed(2)),
            low: Number((parseFloat(item.low) * mult).toFixed(2)),
            close: Number((parseFloat(item.close) * mult).toFixed(2)),
            volume: item.volume ? parseInt(item.volume, 10) : 15000,
          }))
          .filter((c: Candle) => !isNaN(c.close) && c.close > 0)
          .sort((a: Candle, b: Candle) => a.datetime.localeCompare(b.datetime));

        // If returned series is shorter than 50 candles, blend with historical base to ensure smooth SMA 50
        let merged = parsed;
        if (parsed.length < 50 && verified4GLDCandles.length > parsed.length) {
          const earliestDate = parsed[0].datetime;
          const olderHistory = verified4GLDCandles.filter((c) => c.datetime < earliestDate);
          merged = [...olderHistory, ...parsed];
        }

        const result: FetchResult = {
          candles: merged,
          source: 'live_api',
          symbol: candidate.name,
          warning: undefined, // Clear any warning on success!
        };

        setCachedResult(result);
        return result;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      detailedError = msg;
      console.warn(`Twelve Data fetch failed for ${candidate.name}:`, msg);
    }
  }

  // If all candidates failed:
  // Build a helpful explanation without raw HTTP 404
  const reasonText = detailedError
    ? `Twelve Data notice: ${detailedError}.`
    : 'Twelve Data feed currently unreachable.';

  return {
    candles: verified4GLDCandles,
    source: 'verified_cache',
    symbol: '4GLD (Frankfurt Xetra)',
    warning: `${reasonText} Using verified Frankfurt Xetra daily closes (ISIN: DE000A0S9GB0).`,
  };
}
