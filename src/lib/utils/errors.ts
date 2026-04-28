/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Authentication error
 */
export class AuthError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthError';
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed', public fields?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

/**
 * Network error
 */
export class NetworkError extends AppError {
  constructor(message = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'NetworkError';
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Parse error from API response
 */
export function parseApiError(error: any): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || 'An error occurred';

    switch (status) {
      case 401:
        return new AuthError(message);
      case 404:
        return new NotFoundError(message);
      case 400:
      case 422:
        return new ValidationError(message, error.response.data?.fields);
      default:
        return new AppError(message, 'API_ERROR', status);
    }
  }

  if (error.message) {
    return new NetworkError(error.message);
  }

  return new AppError('An unknown error occurred', 'UNKNOWN_ERROR');
}

/**
 * Log error to console (or send to error tracking service)
 */
export function logError(error: Error, context?: Record<string, any>): void {
  console.error('Error:', {
    name: error.name,
    message: error.message,
    code: (error as AppError).code,
    statusCode: (error as AppError).statusCode,
    context,
    stack: error.stack,
  });
}
