import config from 'config';
import ConnectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import { Application } from 'express';
import session from 'express-session';
import Redis from 'ioredis';

const logger = (require('@hmcts/nodejs-logging')).Logger.getLogger('SessionStorage');

export class SessionStorage {
  private RedisStore = ConnectRedis(session);
  private MemoryStore = require('express-session').MemoryStore;

  private cookieMaxAge = 30 * (60 * 1000); // 30 minutes

  public enableFor(app: Application): void {
    app.use(cookieParser());
    app.set('trust proxy', 1);

    const sessionStore = this.getStore();
    app.use(
      session({
        name: 'lau-session',
        resave: false,
        saveUninitialized: false,
        secret: config.get('redis.password'),
        cookie: {
          httpOnly: true,
          maxAge: this.cookieMaxAge,
          sameSite: 'lax', // required for the oauth2 redirect
          secure: app.locals.ENV !== 'test',
        },
        rolling: true, // Renew the cookie for another 30 minutes on each request
        store: sessionStore,
      }),
    );

    app.locals.sessionStore = sessionStore;
  }

  public getStore(): ConnectRedis.RedisStore {
    const redisEnabled = config.get('redis.enabled');
    if (redisEnabled) {
      const host: string = config.get('redis.host');
      const password: string = config.get('redis.password');
      const port: number = config.get('redis.port');
      const ttl: number = config.get('redis.ttl');

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

      return new this.RedisStore({ client, ttl });
    } else if (config.get('environment') === 'prod') {
      throw new Error('Redis disabled in production!');
    }

    // FOR DEV ONLY
    return new this.MemoryStore();
  }
}
