import { Application } from 'express';
import {MetadataObj} from '../../models/common';
import * as os from 'os';
import Redis from 'ioredis';

interface HealthResponse {
  body: { status: string; }
}

import logger from '../../modules/logging';
const healthcheck = require('@hmcts/nodejs-healthcheck');

const config = require('config');

/**
 * Sets up the HMCTS info and health endpoints
 */
export class HealthCheck {
  public enableFor(app: Application): void {
    const checks: MetadataObj = {};
    const readinessChecks: MetadataObj = {};

    const services = [
      'lau-case-backend',
      'lau-idam-backend',
      'idam-api',
      's2s',
    ];

    services.forEach(service => {
      if (config.get(`services.${service}.enabled`) as boolean) {
        checks[service] = this.serviceHealthcheck(service);
      }
    });

    if (config.get('redis.enabled') as boolean) {
      const redisHealthcheck = this.redisHealthCheck(app);
      checks.redis = redisHealthcheck;
      readinessChecks.redis = redisHealthcheck;
    }

    const healthCheckConfig = {
      checks,
      readinessChecks,
      buildInfo: {
        name: config.service.name,
        host: os.hostname(),
        uptime: process.uptime(),
      },
    };

    healthcheck.addTo(app, healthCheckConfig);
  }

  private serviceHealthcheck(serviceName: string, timeout = 5000, deadline = 10000) {
    return healthcheck.web(new URL('/health', config.get(`services.${serviceName}.url`)), {
      callback: (err: ErrorCallback, res: HealthResponse) => {
        const status = err ? 'DOWN' : res.body.status || 'DOWN';
        if (status === 'DOWN') {
          logger.warn(`${serviceName} is DOWN`);
          logger.warn(err);
        }
        return status === 'UP' ? healthcheck.up() : healthcheck.down();
      },
      timeout: timeout,
      deadline: deadline,
    });
  }

  private redisHealthCheck(app: Application) {
    const redisClient: Redis = app.locals.redisClient;

    return healthcheck.raw(async () => {
      const healthy = await this.getRedisHealth(redisClient);
      if (!healthy) {
        logger.info('redis is DOWN');
      }
      return healthy ? healthcheck.up() : healthcheck.down();
    });
  }

  private getRedisHealth(redisClient: Redis, timeout = 5000): Promise<boolean> {
    // If the ping response is not returned within the specified timeout, false is return.
    return Promise.race([
      redisClient.ping().then(value => value === 'PONG'),
      new Promise(resolve => setTimeout(() => resolve(false), timeout)),
    ]) as Promise<boolean>;
  }
}
