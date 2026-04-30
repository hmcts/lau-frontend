#!/usr/bin/env node

// appinsights and properties volume need to be above app import
import {appInsights} from './modules/appinsights';
import {PropertiesVolume} from './modules/properties-volume';

const env = process.env.NODE_ENV || 'development';

new PropertiesVolume().enableFor(env);
appInsights.enable();

const shutdown = async () => {
  await appInsights.flush();
};
process.on('beforeExit', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('uncaughtException', shutdown);
process.on('unhandledRejection', shutdown);

import { app } from './app';
import logger from './modules/logging';

const sslConfig = require('ssl-config')('modern');

import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';

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
