import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const customLevels = {
  levels: {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    critical: 'red bold',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
  },
};

const customFormat = format.combine(
  format.colorize({ all: true }),
  format.errors({ stack: true }),
  format.splat(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    const logLevel = level || 'info';
    return `[${timestamp} ${logLevel}]: ${message}`;
  }),
);

const logger = createLogger({
  levels: customLevels.levels,
  level: 'info',
  format: customFormat,
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: 'logs/app-info-%DATE%.log',
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new DailyRotateFile({
      filename: 'logs/app-error-%DATE%.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

export default logger;
