const winston = require('winston');
import TransportStream from 'winston-transport';
import { appInsights, LogLevel } from '../appinsights';

import type { LogEntry } from 'winston';
import type { TransportStreamOptions } from 'winston-transport';

// Don't pollute our logs with _csrf parameter
const KEYS_TO_FILTER = ['_csrf'];

class AppInsightsTransport extends TransportStream {
  constructor(opts?: TransportStreamOptions) {
    super(opts);
  }

  log(info: LogEntry, callback: () => void) {
    setImmediate(() => this.emit('logged', info));

    const { level, message, ...meta } = info;

    appInsights.trackTrace({
      message,
      level: level as LogLevel,
      properties: meta,
    });

    callback();
  }
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format((info: Record<string, unknown>) => {
      KEYS_TO_FILTER.forEach((key: string) => {
        if (key in info) {
          delete info[key];
        }
      });

      return info;
    })(),
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({level: 'info'}),
    new AppInsightsTransport({level: 'info'}),
  ],
});

export default logger;
