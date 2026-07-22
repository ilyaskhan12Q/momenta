export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
  child(moduleName: string): ILogger;
}
