import express from 'express';
import type { BalanceRepository } from './balances/balance.repository.js';
import { createBalanceRouter } from './balances/balance.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const createApp = (repository: BalanceRepository) => {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '10kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/balances', createBalanceRouter(repository));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
