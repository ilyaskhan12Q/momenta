import pino, { Logger, DestinationStream, LoggerOptions } from 'pino';
import { ILogger } from './ILogger';

export class PinoLogger implements ILogger {
  private readonly logger: Logger;

  constructor(moduleName: string, options?: LoggerOptions, stream?: DestinationStream) {
    const envLevel = process.env.LOG_LEVEL;
    const logLevel = options?.level || (envLevel && envLevel !== 'undefined' ? envLevel : 'info');
    const pinoOptions: LoggerOptions = {
      ...options,
      level: logLevel,
    };

    const rootLogger = stream ? pino(pinoOptions, stream) : pino(pinoOptions);
    this.logger = rootLogger.child({ module: moduleName });
  }

  private static fromPinoInstance(logger: Logger): PinoLogger {
    const instance = Object.create(PinoLogger.prototype);
    (instance as any).logger = logger;
    return instance;
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (context) {
      this.logger.info(context, message);
    } else {
      this.logger.info(message);
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (context) {
      this.logger.warn(context, message);
    } else {
      this.logger.warn(message);
    }
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const payload: Record<string, unknown> = { ...context };
    if (error !== undefined) {
      payload.err = error;
    }

    if (Object.keys(payload).length > 0) {
      this.logger.error(payload, message);
    } else {
      this.logger.error(message);
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (context) {
      this.logger.debug(context, message);
    } else {
      this.logger.debug(message);
    }
  }

  child(moduleName: string): ILogger {
    const childPino = this.logger.child({ module: moduleName });
    return PinoLogger.fromPinoInstance(childPino);
  }
}
