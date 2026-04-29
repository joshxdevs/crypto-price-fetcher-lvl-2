import app from './app';
import { env } from './config/env';

const server = app.listen(env.port, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════╗');
  console.log('  ║          CryptoLens API               ║');
  console.log('  ╚═══════════════════════════════════════╝');
  console.log('');
  console.log(`  🚀 Server running on http://localhost:${env.port}`);
  console.log(`  🌍 Environment : ${env.nodeEnv}`);
  console.log(`  📡 API Base    : http://localhost:${env.port}/api/v1`);
  console.log('');
  console.log('  Endpoints:');
  console.log(`    GET /api/v1/health`);
  console.log(`    GET /api/v1/price/btc`);
  console.log(`    GET /api/v1/price/eth`);
  console.log(`    GET /api/v1/price/sol`);
  console.log(`    GET /api/v1/news`);
  console.log('');
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

const gracefulShutdown = (signal: string): void => {
  console.log(`\n  [Server] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('  [Server] HTTP server closed.');
    process.exit(0);
  });

  // Force exit if not closed within 10s
  setTimeout(() => {
    console.error('  [Server] Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: unknown) => {
  console.error('[Server] Unhandled Promise Rejection:', reason);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error: Error) => {
  console.error('[Server] Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

export default server;
