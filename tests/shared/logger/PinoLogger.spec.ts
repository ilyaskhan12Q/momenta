import { describe, it, expect, beforeEach } from 'vitest';
import { PinoLogger } from '../../../src/shared/logger/PinoLogger';
import { ILogger } from '../../../src/shared/logger/ILogger';
import { Writable } from 'stream';

describe('PinoLogger', () => {
  let logs: any[] = [];
  let testStream: Writable;

  beforeEach(() => {
    logs = [];
    testStream = new Writable({
      write(chunk, _encoding, callback) {
        try {
          const logObj = JSON.parse(chunk.toString());
          logs.push(logObj);
        } catch (e) {
          // ignore non-json
        }
        callback();
      },
    });
  });

  it('should implement ILogger interface and log info message', () => {
    const logger: ILogger = new PinoLogger('TestModule', undefined, testStream);
    logger.info('User logged in', { userId: '123' });

    expect(logs.length).toBe(1);
    expect(logs[0].msg).toBe('User logged in');
    expect(logs[0].userId).toBe('123');
    expect(logs[0].module).toBe('TestModule');
    expect(logs[0].level).toBe(30); // Pino info level is 30
  });

  it('should log warn message with context', () => {
    const logger: ILogger = new PinoLogger('TestModule', undefined, testStream);
    logger.warn('High memory usage', { usageMB: 512 });

    expect(logs.length).toBe(1);
    expect(logs[0].msg).toBe('High memory usage');
    expect(logs[0].usageMB).toBe(512);
    expect(logs[0].module).toBe('TestModule');
    expect(logs[0].level).toBe(40); // Pino warn level is 40
  });

  it('should log error message with Error object and context', () => {
    const logger: ILogger = new PinoLogger('TestModule', undefined, testStream);
    const err = new Error('Database connection failed');
    logger.error('Failed to connect to DB', err, { host: 'localhost' });

    expect(logs.length).toBe(1);
    expect(logs[0].msg).toBe('Failed to connect to DB');
    expect(logs[0].host).toBe('localhost');
    expect(logs[0].module).toBe('TestModule');
    expect(logs[0].err).toBeDefined();
    expect(logs[0].err.message).toBe('Database connection failed');
    expect(logs[0].level).toBe(50); // Pino error level is 50
  });

  it('should log debug message when log level allows', () => {
    const originalLevel = process.env.LOG_LEVEL;
    process.env.LOG_LEVEL = 'debug';

    const logger: ILogger = new PinoLogger('TestModule', undefined, testStream);
    logger.debug('Debugging query', { query: 'SELECT 1' });

    expect(logs.length).toBe(1);
    expect(logs[0].msg).toBe('Debugging query');
    expect(logs[0].query).toBe('SELECT 1');
    expect(logs[0].level).toBe(20); // Pino debug level is 20

    if (originalLevel !== undefined) {
      process.env.LOG_LEVEL = originalLevel;
    } else {
      delete process.env.LOG_LEVEL;
    }
  });

  it('should create a child logger with attached module name', () => {
    const parentLogger: ILogger = new PinoLogger('ParentModule', undefined, testStream);
    const childLogger = parentLogger.child('ChildModule');

    childLogger.info('Child operation', { detail: 'abc' });

    expect(logs.length).toBe(1);
    expect(logs[0].msg).toBe('Child operation');
    expect(logs[0].detail).toBe('abc');
    expect(logs[0].module).toBe('ChildModule');
  });

  it('should default log level to info if process.env.LOG_LEVEL is not set', () => {
    const originalLevel = process.env.LOG_LEVEL;
    delete process.env.LOG_LEVEL;

    const logger: ILogger = new PinoLogger('TestModule', undefined, testStream);
    logger.debug('This debug should be ignored');
    logger.info('This info should be logged');

    expect(logs.length).toBe(1);
    expect(logs[0].msg).toBe('This info should be logged');

    if (originalLevel !== undefined) {
      process.env.LOG_LEVEL = originalLevel;
    } else {
      delete process.env.LOG_LEVEL;
    }
  });
});
