#!/usr/bin/env node
import {DataService} from './service/DataService';

const { Logger } = require('@hmcts/nodejs-logging');
import { app } from './app';

const sslConfig = require('ssl-config')('modern');

import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import config from 'config';

const logger = Logger.getLogger('server');
const port: number = parseInt(process.env.PORT, 10) || 4000;

const dataService = DataService.getInstance();
const resourcesDirectory = path.join(__dirname, 'resources');
const jurisdictionsCaseTypesFile: string = config.get('ccd.dataFile');
const fullJurisdictionsCaseTypesFilePath = path.join(resourcesDirectory, 'data', jurisdictionsCaseTypesFile);

if (app.locals.ENV === 'development') {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');
  const server = https.createServer({
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt')),
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
    ciphers: sslConfig.ciphers,
    secureOptions: sslConfig.minimumTLSVersion,
  }, app);

  dataService.loadData(fullJurisdictionsCaseTypesFilePath);

  server.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}`);
  });
} else {
  dataService.downloadData(
    config.get('ccd.url'),
    config.get('ccd.username'),
    config.get('ccd.password'),
    fullJurisdictionsCaseTypesFilePath,
  ).then(() => {
    logger.info('Fetched jurisdictions and case types, loading...');
    dataService.loadData(fullJurisdictionsCaseTypesFilePath);
  }).catch(() => {
    logger.error('Failed to download jurisdictions and case types data file');
  });

  app.listen(port, () => {
    logger.info(`Express application started: http://localhost:${port}`);
  });
}
