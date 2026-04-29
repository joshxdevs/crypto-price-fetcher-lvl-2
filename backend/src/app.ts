import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import cryptoRoutes from './routes/crypto.routes';
import { errorMiddleware, AppError } from './middlewares/error.middleware';

const app: Application = express();

// ─── Security Middleware ───────────────────────────────────────────────────────

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (env.cors.origins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new AppError(`CORS: Origin ${origin} is not allowed`, 403));
    },
    methods: ['GET'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────

const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many requests. Please slow down.',
      statusCode: 429,
    },
  },
});

app.use('/api', limiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Request Logger (dev only) ────────────────────────────────────────────────

if (!env.isProduction) {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/v1', cryptoRoutes);

// ─── Root ─────────────────────────────────────────────────────────────────────

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      service: 'CryptoLens API',
      version: '1.0.0',
      docs: '/api/v1/health',
      endpoints: [
        'GET /api/v1/health',
        'GET /api/v1/price/btc',
        'GET /api/v1/price/eth',
        'GET /api/v1/price/sol',
        'GET /api/v1/news',
      ],
    },
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route not found`, 404));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use(errorMiddleware);

export default app;
