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

// ─── Cache ────────────────────────────────────────────────────────────────────

const priceCache: Record<string, { data: PriceData; timestamp: number }> = {};
const CACHE_TTL = 30_000; // 30 seconds

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Fetches price data for a single coin from CoinGecko with caching.
 * @param ticker - Short ticker symbol: 'btc' | 'eth' | 'sol'
 */
export const getCoinPrice = async (ticker: string): Promise<PriceData> => {
  const coinId = COIN_ID_MAP[ticker.toLowerCase()];

  if (!coinId) {
    throw new AppError(`Unsupported coin ticker: ${ticker}`, 400);
  }

  const now = Date.now();
  if (priceCache[coinId] && now - priceCache[coinId].timestamp < CACHE_TTL) {
    return priceCache[coinId].data;
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

    const result = {
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      last_updated: coin.last_updated,
    };

    priceCache[coinId] = { data: result, timestamp: Date.now() };
    return result;
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

    // If API key is missing or data is invalid, return mock data gracefully
    if (data?.Response === 'Error' || !data?.Data || !Array.isArray(data.Data)) {
      return [
        {
          id: '1',
          title: 'Bitcoin Surges Past Key Resistance Level Following Market Optimism',
          body: 'Bitcoin has experienced a significant surge over the past 24 hours, pushing past major resistance levels. Analysts suggest this is driven by increased institutional adoption and favorable macroeconomic conditions.',
          url: 'https://example.com/news/1',
          source: 'CryptoLens Daily',
          publishedAt: new Date().toISOString(),
          imageUrl: '',
          categories: 'BTC|Market',
        },
        {
          id: '2',
          title: 'Ethereum Foundation Announces Major Network Upgrade Timeline',
          body: 'The Ethereum Foundation has released the official timeline for the next major network upgrade. This upgrade promises to significantly reduce gas fees and improve transaction throughput across layer-2 networks.',
          url: 'https://example.com/news/2',
          source: 'CryptoLens Daily',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          imageUrl: '',
          categories: 'ETH|Tech',
        },
        {
          id: '3',
          title: 'Solana DeFi Ecosystem Reaches New Total Value Locked Milestone',
          body: 'Solana continues its strong performance this quarter, with its DeFi ecosystem reaching a new milestone in Total Value Locked (TVL). Several new protocols have launched this week contributing to the growth.',
          url: 'https://example.com/news/3',
          source: 'CryptoLens Daily',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          imageUrl: '',
          categories: 'SOL|DeFi',
        }
      ];
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
  Response?: string;
  Data: CryptoCompareNewsItem[];
  Message: string;
  Type: number;
}
