import type { ErrorRequestHandler, RequestHandler } from 'express';
import { HttpError } from '../errors.js';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ error: { message: `Route ${req.method} ${req.originalUrl} not found` } });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: { message: error.message, details: error.details } });
    return;
  }

  if (typeof error === 'object' && error !== null && 'status' in error && 'type' in error) {
    const status = Number(error.status);
    const message = error.type === 'entity.parse.failed' ? 'Request body is not valid JSON' : 'Invalid request body';
    res.status(status >= 400 && status < 500 ? status : 400).json({ error: { message } });
    return;
  }

  console.error(error);
  res.status(500).json({ error: { message: 'Internal server error' } });
};
