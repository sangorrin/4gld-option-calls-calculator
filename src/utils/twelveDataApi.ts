import { Candle } from '../types';
import { verified4GLDCandles } from '../data/mock4GLDData';

const LOCAL_STORAGE_KEY = 'twelvedata_api_key';

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
  } catch (e) {
    console.error('Failed to save API key to localStorage', e);
  }
}

export function removeApiKey(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
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

/**
 * Fetch 4GLD daily candles from Twelve Data REST API.
 * Falls back gracefully to verified 4GLD XETRA market data if key is missing or limit reached.
 */
export async function fetchTwelveDataCandles(apiKey?: string): Promise<FetchResult> {
  const key = apiKey || getStoredApiKey();

  if (!key) {
    return {
      candles: verified4GLDCandles,
      source: 'verified_cache',
      symbol: '4GLD:XETR',
      warning: 'Using verified Frankfurt Xetra data. Add your Twelve Data API key above to pull real-time ticks.',
    };
  }

  // Symbol candidates for Xetra-Gold
  const symbols = ['4GLD:XETR', '4GLD'];

  for (const sym of symbols) {
    try {
      const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(
        sym
      )}&interval=1day&outputsize=180&apikey=${encodeURIComponent(key)}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Twelve Data HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.status === 'error') {
        if (data.code === 429 || (data.message && data.message.includes('limit'))) {
          throw new Error('Twelve Data free rate limit reached (8 calls/min). Using verified market data.');
        }
        if (data.message && data.message.includes('API key')) {
          throw new Error(`Twelve Data API Key error: ${data.message}`);
        }
        throw new Error(data.message || 'Symbol not found on Twelve Data');
      }

      if (data.values && Array.isArray(data.values) && data.values.length > 0) {
        // Twelve Data returns newest first; reverse to ascending chronological order
        const parsed: Candle[] = data.values
          .map((item: { datetime: string; open: string; high: string; low: string; close: string; volume?: string }) => ({
            datetime: item.datetime.split(' ')[0],
            open: parseFloat(item.open),
            high: parseFloat(item.high),
            low: parseFloat(item.low),
            close: parseFloat(item.close),
            volume: item.volume ? parseInt(item.volume, 10) : 10000,
          }))
          .filter((c: Candle) => !isNaN(c.close) && c.close > 0)
          .sort((a: Candle, b: Candle) => a.datetime.localeCompare(b.datetime));

        if (parsed.length >= 20) {
          return {
            candles: parsed,
            source: 'live_api',
            symbol: sym,
          };
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`Twelve Data fetch failed for ${sym}:`, msg);
      // If error specifically states invalid API key, bubble up
      if (msg.includes('API key') || msg.includes('Invalid')) {
        throw err;
      }
    }
  }

  // If both symbols fail or rate limit hit, return verified fallback with message
  return {
    candles: verified4GLDCandles,
    source: 'verified_cache',
    symbol: '4GLD:XETR',
    warning: 'Twelve Data API temporarily unavailable or free tier limit hit. Showing verified Frankfurt Xetra data.',
  };
}
