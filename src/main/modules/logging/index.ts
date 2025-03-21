const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['info', 'warn', 'error', 'critical'],
      consoleWarnLevels: ['info', 'warn', 'error', 'critical'],
    }),
  ],
});

export default logger;
