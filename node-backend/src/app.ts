import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { config } from './config';
import routes from './routes';
import { logger } from './utils/logger';

export const createApp = () => {
  const app = express();

  // ── Middleware ───────────────────────────────────────────────────────────
  app.use(cors({ origin: config.cors.origins }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev', {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }));

  // ── Static: serve uploaded images ────────────────────────────────────────
  app.use('/uploads', express.static(path.resolve(config.uploads.dir)));

  // ── Routes ───────────────────────────────────────────────────────────────
  app.use('/', routes);

  // ── 404 ──────────────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // ── Global error handler ─────────────────────────────────────────────────
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error('Unhandled error: %s', err.message);

    const statusCode = err.status || err.statusCode || 500;
    const message = config.nodeEnv === 'production'
      ? 'Internal server error'
      : err.message;

    res.status(statusCode).json({ error: message });
  });

  return app;
};
