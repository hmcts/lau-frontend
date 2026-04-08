import config from 'config';
import { RedisStore } from 'connect-redis';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import session from 'express-session';
import type { Store } from 'express-session';
import Redis from 'ioredis';

import logger from '../../modules/logging';
import {MINUTE_IN_MS} from '../../util/Util';
import {AppRequest} from '../../models/appRequest';
import {AppError, ErrorCode} from '../../models/AppError';

export class SessionStorage {
  private readonly MemoryStore = require('express-session').MemoryStore;

  private readonly cookieMaxAgeInMs: number = (config.get('session.cookieMaxAge') as number) * MINUTE_IN_MS;

  public enableFor(app: Application): void {
    app.use(cookieParser());
    app.set('trust proxy', 1);
    const sessionStore = this.getStore(app);
    app.use(
      session({
        name: 'lau-session',
        resave: false,
        saveUninitialized: false,
        secret: config.get('session.secret'),
        cookie: {
          httpOnly: true,
          maxAge: this.cookieMaxAgeInMs,
          sameSite: 'lax', // required for the oauth2 redirect
          secure: app.locals.ENV !== 'test',
        },
        rolling: true, // Renew the cookie for another 30 minutes on each request
        store: sessionStore,
      }),
    );

    app.locals.sessionStore = sessionStore;
  }

  public getStore(app: Application): RedisStore {
    const redisEnabled = config.get('redis.enabled');
    if (redisEnabled) {
      const host: string = config.get('redis.host');
      const password: string = config.get('redis.password');
      const port: number = config.get('redis.port');
      const ttl: number = config.get('redis.ttl');

      if (!password || password.trim().length === 0) {
        throw new Error('Redis password is empty; cannot set up Redis.');
      }

      const tlsOptions = {
        password: password,
        tls: true,
        connectTimeout: 15000,
      };

      const redisOptions = config.get('redis.useTLS') === 'true' ? tlsOptions : {};

      logger.info(`Redis Connection - Host: ${host}, Port: ${port}`);

      const client = new Redis(port, host, redisOptions);

      // Azure Cache for Redis has issues with a 10 minute connection idle timeout, the recommendation is to keep the connection alive
      // https://gist.github.com/JonCole/925630df72be1351b21440625ff2671f#file-redis-bestpractices-node-js-md
      client.on('ready', () => {
        setInterval(() => {
          client.ping();
        }, 60000); // 60s
      });

      app.locals.redisClient = client;
      return new RedisStore({ client, ttl });
    } else if (config.get('environment') === 'prod') {
      throw new Error('Redis disabled in production!');
    }

    // FOR DEV ONLY
    return new this.MemoryStore();
  }

  private getUserSessionKey(userId: string): string {
    return `user-session:${userId}`;
  }

  public async terminateOtherSessions(req: AppRequest, ttlMs: number): Promise<void> {
    const userId = req.session.user?.id;
    const redisEnabled = Boolean(config.get('redis.enabled'));
    const redisClient = req.app.locals.redisClient as Redis | undefined;
    const sessionStore = req.app.locals.sessionStore as Store | undefined;

    if (!userId) return;

    if (!redisEnabled) {
      return;
    }

    if (!redisClient || !sessionStore) {
      logger.error('Redis is enabled but session store or redis client is missing');
      throw new AppError('Redis is unavailable', ErrorCode.REDIS);
    }

    const key = this.getUserSessionKey(userId);
    const currentSessionId = req.sessionID;

    try {
      const previousSessionId = await redisClient.get(key);
      if (previousSessionId && previousSessionId !== currentSessionId) {
        await new Promise<void>((resolve) => {
          sessionStore.destroy(previousSessionId, () => resolve());
        });
      }

      await redisClient.set(key, currentSessionId, 'PX', ttlMs);
    } catch (error) {
      logger.error(`Redis error when terminating other sessions: ${error}`);
      throw new AppError('Redis is unavailable', ErrorCode.REDIS);
    }
  }

  public async clearSessionMapping(req: AppRequest): Promise<void> {
    const userId = req.session.user?.id;
    const redisClient = req.app.locals.redisClient as Redis | undefined;

    if (!userId || !redisClient) return;
    const key = this.getUserSessionKey(userId);
    await redisClient.del(key);
  }
}
