const winston = require('winston');
import TransportStream from 'winston-transport';
import * as appInsights from 'applicationinsights';

import type { LogEntry } from 'winston';
import type { TransportStreamOptions } from 'winston-transport';

class AppInsightsTransport extends TransportStream {
  constructor(opts?: TransportStreamOptions) {
    super(opts);
  }

  log(info: LogEntry, callback: () => void) {
    setImmediate(() => this.emit('logged', info));

    const client = appInsights.defaultClient;
    if (client) {
      client.trackTrace({
        message: info.message,
        properties: {
          level: info.level,
          ...info.meta,
        },
      });
    }

    callback();
  }
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({level: 'info'}),
    new AppInsightsTransport({level: 'info'}),
  ],
});

export default logger;
