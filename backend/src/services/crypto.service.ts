import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';
import { AppError } from '../middlewares/error.middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PriceData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  last_updated: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  body: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  categories: string;
}

// ─── Axios Clients ────────────────────────────────────────────────────────────

const coingeckoClient: AxiosInstance = axios.create({
  baseURL: env.coingecko.baseUrl,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const cryptoCompareClient: AxiosInstance = axios.create({
  baseURL: env.cryptoCompare.baseUrl,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Authorization': `Apikey ${env.cryptoCompare.apiKey}`,
  },
});

// ─── Helper ───────────────────────────────────────────────────────────────────

const COIN_ID_MAP: Record<string, string> = {
  btc: 'bitcoin',
  eth: 'ethereum',
  sol: 'solana',
};

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Fetches price data for a single coin from CoinGecko.
 * @param ticker - Short ticker symbol: 'btc' | 'eth' | 'sol'
 */
export const getCoinPrice = async (ticker: string): Promise<PriceData> => {
  const coinId = COIN_ID_MAP[ticker.toLowerCase()];

  if (!coinId) {
    throw new AppError(`Unsupported coin ticker: ${ticker}`, 400);
  }

  try {
    const { data } = await coingeckoClient.get<CoinGeckoMarket[]>(
      '/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          ids: coinId,
          order: 'market_cap_desc',
          per_page: 1,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h',
        },
      }
    );

    if (!data || data.length === 0) {
      throw new AppError(`No price data found for ${ticker.toUpperCase()}`, 404);
    }

    const coin = data[0];

    return {
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      last_updated: coin.last_updated,
    };
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 502;
      throw new AppError(`CoinGecko API error: ${err.message}`, status);
    }
    throw new AppError('Failed to fetch price data', 502);
  }
};

/**
 * Fetches latest crypto news from CryptoCompare.
 * Falls back gracefully if API key is missing.
 */
export const getCryptoNews = async (limit = 10): Promise<NewsArticle[]> => {
  try {
    const { data } = await cryptoCompareClient.get<CryptoCompareNewsResponse>(
      '/data/v2/news/',
      {
        params: {
          lang: 'EN',
          sortOrder: 'latest',
          extraParams: 'CryptoLens',
        },
      }
    );

    if (!data?.Data || !Array.isArray(data.Data)) {
      throw new AppError('Invalid news data received', 502);
    }

    return data.Data.slice(0, limit).map((article) => ({
      id: String(article.id),
      title: article.title,
      body: article.body.length > 300 ? article.body.substring(0, 297) + '...' : article.body,
      url: article.url,
      source: article.source,
      publishedAt: new Date(article.published_on * 1000).toISOString(),
      imageUrl: article.imageurl,
      categories: article.categories,
    }));
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 502;
      throw new AppError(`News API error: ${err.message}`, status);
    }
    throw new AppError('Failed to fetch news data', 502);
  }
};

// ─── CoinGecko Raw Types ──────────────────────────────────────────────────────

interface CoinGeckoMarket {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
  last_updated: string;
}

// ─── CryptoCompare Raw Types ──────────────────────────────────────────────────

interface CryptoCompareNewsItem {
  id: number;
  title: string;
  body: string;
  url: string;
  source: string;
  published_on: number;
  imageurl: string;
  categories: string;
}

interface CryptoCompareNewsResponse {
  Data: CryptoCompareNewsItem[];
  Message: string;
  Type: number;
}
