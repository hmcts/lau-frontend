#!/usr/bin/env node

import * as http from 'node:http';
import * as https from 'node:https';
import path from 'node:path';
import process from 'node:process';
import { readFileSync } from 'node:fs';
import { once } from 'node:events';
import type { Application } from 'express';
import type { Server } from 'node:net';

import { appInsights } from './modules/appinsights';
import { PropertiesVolume } from './modules/properties-volume';

async function bootstrap(): Promise<void> {
  const env = process.env.NODE_ENV || 'development';

  // Initialize properties volume and application insights before importing the app
  new PropertiesVolume().enableFor(env);
  appInsights.enable();

  const { app } = await import('./app');
  const { default: logger } = await import('./modules/logging');
  const port: number = parseInt(process.env.PORT, 10) || 4000;

  const server = env === 'development'
    ? await createDevelopmentServer(app)
    : http.createServer(app);

  server.listen(port);
  await once(server, 'listening');

  logger.info(`Application started: localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});


const shutdown = async () => {
  try {
    await appInsights.flush();
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function createDevelopmentServer(app: Application): Promise<Server> {
  const { default: createSslConfig } = await import('ssl-config');
  const sslConfig = createSslConfig('modern');
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');

  const server = https.createServer({
    cert: readFileSync(path.join(sslDirectory, 'localhost.crt')),
    key: readFileSync(path.join(sslDirectory, 'localhost.key')),
    ciphers: sslConfig.ciphers,
    secureOptions: sslConfig.minimumTLSVersion,
  }, app);

  return server;
}
