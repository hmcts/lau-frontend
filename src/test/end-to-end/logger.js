const winston = require('winston');


const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({level: 'info'}),
  ],
});

module.exports = logger;
