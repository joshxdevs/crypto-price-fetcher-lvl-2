import { Request, Response, NextFunction } from 'express';
import { getCoinPrice, getCryptoNews } from '../services/crypto.service';
import { asyncHandler } from '../middlewares/error.middleware';

// ─── Price Controllers ─────────────────────────────────────────────────────────

export const getBtcPrice = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const data = await getCoinPrice('btc');
    res.status(200).json({ success: true, data });
  }
);

export const getEthPrice = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const data = await getCoinPrice('eth');
    res.status(200).json({ success: true, data });
  }
);

export const getSolPrice = asyncHandler(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const data = await getCoinPrice('sol');
    res.status(200).json({ success: true, data });
  }
);

// ─── News Controller ───────────────────────────────────────────────────────────

export const getNews = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const limit = Math.min(parseInt((req.query['limit'] as string) ?? '10', 10), 50);
    const data = await getCryptoNews(limit);
    res.status(200).json({ success: true, count: data.length, data });
  }
);

// ─── Health Controller ─────────────────────────────────────────────────────────

export const getHealth = (
  _req: Request,
  res: Response
): void => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'CryptoLens API',
      version: '1.0.0',
      environment: process.env['NODE_ENV'] ?? 'development',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
    },
  });
};
