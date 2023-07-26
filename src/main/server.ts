#!/usr/bin/env node
// AppInsights needs to be imported / required before winston logger to transport logs to AppInsights 
import { AppInsights } from './modules/appinsights';
new AppInsights().enable();

const sslConfig = require('ssl-config')('modern');
const { Logger } = require('@hmcts/nodejs-logging');

import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import { app } from './app';

const logger = Logger.getLogger('server');
const port: number = parseInt(process.env.PORT, 10) || 4000;

if (app.locals.ENV === 'development') {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');
  const server = https.createServer({
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt')),
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
    ciphers: sslConfig.ciphers,
    secureOptions: sslConfig.minimumTLSVersion,
  }, app);
  server.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    logger.info(`Application started: http://localhost:${port}`);
  });
}
