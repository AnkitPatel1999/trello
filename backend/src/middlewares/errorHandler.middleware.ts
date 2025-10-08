import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiResponse } from '../utils/apiResponse';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Unhandled error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    ApiResponse.badRequest(res, 'Validation failed', error.message);
    return;
  }

  if (error.name === 'UnauthorizedError') {
    ApiResponse.unauthorized(res, 'Unauthorized', error.message);
    return;
  }

  if (error.name === 'CastError') {
    ApiResponse.badRequest(res, 'Invalid ID format');
    return;
  }

  if (error.name === 'MongoError' && (error as any).code === 11000) {
    ApiResponse.conflict(res, 'Duplicate entry');
    return;
  }

  // Default error response
  ApiResponse.internalServerError(res, 'Internal server error');
};
