import http from 'http';
import { createApp } from './app';
import { initSocketServer } from './sockets/socketServer';
import { config } from './config';
import { logger } from './utils/logger';

const main = async () => {
  const app = createApp();
  const httpServer = http.createServer(app);

  initSocketServer(httpServer);

  httpServer.listen(config.port, () => {
    logger.info('═══════════════════════════════════════════════');
    logger.info('  🌿 Smart Greenhouse Backend running');
    logger.info(`  Port     : ${config.port}`);
    logger.info(`  Env      : ${config.nodeEnv}`);
    logger.info(`  Python AI: ${config.pythonAi.url}`);
    logger.info(`  Gemini AI: ${config.gemini.apiKey ? 'configured' : 'NOT SET — add GEMINI_API_KEY to .env'}`);
    logger.info('═══════════════════════════════════════════════');
  });

  // Graceful shutdown
  const shutdown = () => {
    logger.info('Shutting down gracefully...');
    httpServer.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

main().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
