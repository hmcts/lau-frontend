#!/usr/bin/env node
const { Logger } = require('@hmcts/nodejs-logging');
import { app } from './app';

const sslConfig = require('ssl-config')('modern');

import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

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
    logger.info(`Express application started: http://localhost:${port}`);
  });
}
