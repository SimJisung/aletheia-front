/**
 * Production-safe logging utilities
 * Only logs in development mode
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  debug(...args: unknown[]): void {
    if (isDev) {
      console.debug('[DEBUG]', ...args);
    }
  },

  info(...args: unknown[]): void {
    if (isDev) {
      console.info('[INFO]', ...args);
    }
  },

  warn(...args: unknown[]): void {
    console.warn('[WARN]', ...args);
  },

  error(...args: unknown[]): void {
    console.error('[ERROR]', ...args);
  },
};
