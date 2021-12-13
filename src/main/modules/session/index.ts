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

  private cookieMaxAge = 10 * (60 * 1000); // 10 minutes

  public enableFor(app: Application): void {
    app.use(cookieParser());

    app.use(
      session({
        name: 'lau-session',
        resave: false,
        saveUninitialized: false,
        secret: config.get('redis.password'),
        cookie: {
          httpOnly: true,
          maxAge: this.cookieMaxAge,
          secure: false,
          sameSite: 'lax',
        },
        rolling: true, // Renew the cookie for another 20 minutes on each request
        store: this.getStore(),
      }),
    );
  }

  public getStore(): ConnectRedis.RedisStore {
    const redisEnabled = config.get('redis.enabled');
    if (redisEnabled) {
      const host: string = config.get('redis.host');
      const password: string = config.get('redis.password');
      const port: number = config.get('redis.port');

      const tlsOptions = {
        password: password,
        tls: true,
      };

      const redisOptions = config.get('redis.useTLS') === 'true' ? tlsOptions : {};

      logger.info(`Redis Connection - Host: ${host}, Port: ${port}, Options: ${JSON.stringify(redisOptions)}`);

      const client = new Redis(port, host, redisOptions);

      return new this.RedisStore({ client });
    } else if (config.get('environment') === 'prod') {
      throw new Error('Redis disabled in production!');
    }

    // FOR DEV ONLY
    return new this.MemoryStore();
  }
}
