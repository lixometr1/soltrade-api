import { config } from 'src/config/config';
import * as winston from 'winston';
export const logger = winston.createLogger({
  level: 'info',
  // format: winston.format.json(),
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD.MM.YY HH:mm:ss' }),
    winston.format.splat(),
    winston.format.simple(),
  ),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({
      filename: config.errorLogPath,
      level: 'error',
    }),
    new winston.transports.File({ filename: config.infoLogPath }),
  ],
});
logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  }),
);
