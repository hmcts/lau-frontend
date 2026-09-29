import winston from 'winston';


const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({level: 'info'}),
  ],
});

export default logger;
