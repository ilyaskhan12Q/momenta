export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 401;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  readonly code = 'FORBIDDEN';
  readonly statusCode = 403;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  readonly code = 'CONFLICT';
  readonly statusCode = 409;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
    this.name = 'ConflictError';
  }
}

export class DatabaseError extends AppError {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
    this.name = 'DatabaseError';
  }
}
