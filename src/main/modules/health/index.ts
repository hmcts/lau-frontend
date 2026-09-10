import { Application } from 'express';
import {MetadataObj} from '../../models/common';
import * as os from 'os';
import type { RedisClientType } from 'redis';

interface HealthResponse {
  body: { status: string; }
}

import logger from '../../modules/logging';
import config from 'config';
import * as healthcheck from '@hmcts/nodejs-healthcheck';

/**
 * Sets up the HMCTS info and health endpoints
 */
export class HealthCheck {
  private redisDownSince: number | null = null;
  private redisRecoveryInFlight = false;
  private static readonly REDIS_RECOVERY_THRESHOLD_MS = 10 * 60 * 1000;

  public enableFor(app: Application): void {
    const checks: MetadataObj = {};
    const readinessChecks: MetadataObj = {};

    const services = [
      'lau-case-backend',
      'lau-idam-backend',
      'lau-eud-backend',
      'idam-api',
      'hmcts-access',
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
        name: config.get('service.name') as string,
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
    const redisClient = app.locals.redisClient as RedisClientType;

    return healthcheck.raw(async () => {
      const healthy = await this.getRedisHealth(redisClient);
      if (healthy) {
        this.redisDownSince = null;
      } else {
        logger.info('redis is DOWN');
        this.handleSustainedRedisFailure(redisClient);
      }
      return healthy ? healthcheck.up() : healthcheck.down();
    });
  }

  private handleSustainedRedisFailure(redisClient: RedisClientType): void {
    const now = Date.now();
    if (!this.redisDownSince) {
      this.redisDownSince = now;
      return;
    }

    const downForMs = now - this.redisDownSince;
    if (downForMs > HealthCheck.REDIS_RECOVERY_THRESHOLD_MS && !this.redisRecoveryInFlight) {
      this.redisRecoveryInFlight = true;
      logger.error(`Redis has been down for ${Math.round(downForMs / 1000)}s - forcing reconnect`);

      void this.forceReconnect(redisClient)
        .catch(error => logger.error(`Forced Redis reconnect failed: ${error}`))
        .finally(() => {
          this.redisRecoveryInFlight = false;
          this.redisDownSince = Date.now();
        });
    }
  }

  private async forceReconnect(redisClient: RedisClientType): Promise<void> {
    await redisClient.close().catch(() => undefined);
    await redisClient.connect();
    logger.warn('Redis client force-reconnected after sustained health check failures');
  }

  private async getRedisHealth(redisClient: RedisClientType, timeout = 5000): Promise<boolean> {
    try {
      const reply = await Promise.race([
        redisClient.ping(),
        new Promise<'TIMEOUT'>((resolve) => setTimeout(() => resolve('TIMEOUT'), timeout)),
      ]);
      return reply === 'PONG';
    } catch (error) {
      logger.warn(`Redis PING failed: ${error}`);
      return false;
    }
  }
}
