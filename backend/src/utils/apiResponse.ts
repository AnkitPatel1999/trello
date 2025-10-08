import { Response } from 'express';

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export class ApiResponse {
  static success<T>(
    res: Response,
    message: string,
    data?: T,
    meta?: IApiResponse['meta'],
    statusCode: number = 200
  ): Response {
    const response: IApiResponse<T> = {
      success: true,
      message,
      ...(data !== undefined && { data }),
      ...(meta !== undefined && { meta }),
    };

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    error?: string,
    statusCode: number = 400
  ): Response {
    const response: IApiResponse = {
      success: false,
      message,
      ...(error !== undefined && { error }),
    };

    return res.status(statusCode).json(response);
  }

  static created<T>(
    res: Response,
    message: string,
    data?: T
  ): Response {
    return this.success(res, message, data, undefined, 201);
  }

  static noContent(res: Response, message: string = 'No content'): Response {
    return this.success(res, message, undefined, undefined, 204);
  }

  static badRequest(
    res: Response,
    message: string = 'Bad request',
    error?: string
  ): Response {
    return this.error(res, message, error, 400);
  }

  static unauthorized(
    res: Response,
    message: string = 'Unauthorized',
    error?: string
  ): Response {
    return this.error(res, message, error, 401);
  }

  static forbidden(
    res: Response,
    message: string = 'Forbidden',
    error?: string
  ): Response {
    return this.error(res, message, error, 403);
  }

  static notFound(
    res: Response,
    message: string = 'Not found',
    error?: string
  ): Response {
    return this.error(res, message, error, 404);
  }

  static conflict(
    res: Response,
    message: string = 'Conflict',
    error?: string
  ): Response {
    return this.error(res, message, error, 409);
  }

  static unprocessableEntity(
    res: Response,
    message: string = 'Unprocessable entity',
    error?: string
  ): Response {
    return this.error(res, message, error, 422);
  }

  static tooManyRequests(
    res: Response,
    message: string = 'Too many requests',
    error?: string
  ): Response {
    return this.error(res, message, error, 429);
  }

  static internalServerError(
    res: Response,
    message: string = 'Internal server error',
    error?: string
  ): Response {
    return this.error(res, message, error, 500);
  }

  static serviceUnavailable(
    res: Response,
    message: string = 'Service unavailable',
    error?: string
  ): Response {
    return this.error(res, message, error, 503);
  }
}
