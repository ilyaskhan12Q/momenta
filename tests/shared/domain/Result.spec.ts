import { describe, it, expect } from 'vitest';
import { Result } from '@/shared/domain/Result';
import {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  DatabaseError,
} from '@/shared/errors/AppError';

describe('Result Monad', () => {
  describe('Result.ok', () => {
    it('creates a successful Result with a value', () => {
      const result = Result.ok<string>('hello');
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.value).toBe('hello');
    });

    it('creates a successful Result without a value (void/undefined)', () => {
      const result = Result.ok<void>();
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.value).toBeUndefined();
    });

    it('throws when accessing error on a successful Result', () => {
      const result = Result.ok('success');
      expect(() => result.error).toThrow('Cannot retrieve error from a successful Result');
    });

    it('freezes the Result object', () => {
      const result = Result.ok('data');
      expect(Object.isFrozen(result)).toBe(true);
    });
  });

  describe('Result.fail', () => {
    it('creates a failed Result with an error', () => {
      const err = new Error('Something went wrong');
      const result = Result.fail<string, Error>(err);

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe(err);
    });

    it('throws when accessing value on a failed Result', () => {
      const err = new Error('Failed operational check');
      const result = Result.fail<string, Error>(err);

      expect(() => result.value).toThrow('Cannot retrieve value from a failed Result: Failed operational check');
    });

    it('freezes the failed Result object', () => {
      const err = new Error('Failure');
      const result = Result.fail(err);
      expect(Object.isFrozen(result)).toBe(true);
    });
  });
});

describe('AppError Hierarchy', () => {
  it('ValidationError has correct code and statusCode', () => {
    const error = new ValidationError('Invalid email', { field: 'email' });
    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Invalid email');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual({ field: 'email' });
  });

  it('UnauthorizedError has correct code and statusCode', () => {
    const error = new UnauthorizedError('Unauthorized access');
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('UNAUTHORIZED');
    expect(error.statusCode).toBe(401);
  });

  it('ForbiddenError has correct code and statusCode', () => {
    const error = new ForbiddenError('Access forbidden');
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('FORBIDDEN');
    expect(error.statusCode).toBe(403);
  });

  it('NotFoundError has correct code and statusCode', () => {
    const error = new NotFoundError('User not found');
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.statusCode).toBe(404);
  });

  it('ConflictError has correct code and statusCode', () => {
    const error = new ConflictError('Resource already exists');
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('CONFLICT');
    expect(error.statusCode).toBe(409);
  });

  it('DatabaseError has correct code and statusCode', () => {
    const error = new DatabaseError('Connection failed');
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('DATABASE_ERROR');
    expect(error.statusCode).toBe(500);
  });

  it('toJSON formats error correctly', () => {
    const error = new ValidationError('Validation failed', { key: 'val' });
    expect(error.toJSON()).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      statusCode: 400,
      details: { key: 'val' },
    });
  });

  it('works in combination with Result.fail', () => {
    const appErr = new NotFoundError('Item missing');
    const result = Result.fail<number, AppError>(appErr);

    expect(result.isFailure).toBe(true);
    expect(result.error).toBeInstanceOf(NotFoundError);
    expect(result.error.code).toBe('NOT_FOUND');
    expect(result.error.statusCode).toBe(404);
  });
});
