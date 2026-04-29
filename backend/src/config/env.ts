import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const parseOrigins = (origins: string | undefined): string[] => {
  if (!origins) return ['http://localhost:5173'];
  return origins.split(',').map((o) => o.trim());
};

export const env = {
  port: parseInt(process.env['PORT'] ?? '5000', 10),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  isProduction: process.env['NODE_ENV'] === 'production',

  coingecko: {
    baseUrl: process.env['COINGECKO_BASE_URL'] ?? 'https://api.coingecko.com/api/v3',
  },

  cryptoCompare: {
    apiKey: process.env['CRYPTOCOMPARE_API_KEY'] ?? '',
    baseUrl: process.env['CRYPTOCOMPARE_BASE_URL'] ?? 'https://min-api.cryptocompare.com',
  },

  cors: {
    origins: parseOrigins(process.env['CORS_ORIGINS']),
  },

  rateLimit: {
    windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] ?? '60000', 10),
    maxRequests: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] ?? '60', 10),
  },
} as const;
