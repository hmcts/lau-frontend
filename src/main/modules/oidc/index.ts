import {AuthService, IdamGrantType} from '../../service/AuthService';
import {Application, NextFunction, Response} from 'express';
import config from 'config';
import {AppRequest} from '../../models/appRequest';
import {AppError, ErrorCode, errorRedirect} from '../../models/AppError';
import Redis from 'ioredis';
import type {Store} from 'express-session';
import logger from '../../modules/logging';

/**
 * Adds the oidc middleware to add oauth authentication
 */
export class OidcMiddleware {

  private approvedRoles = [
    'cft-audit-investigator',
    'cft-service-logs',
  ];

  private nonProtectedUrls = [
    '/health',
    '/health/readiness',
    '/health/liveness',
    '/unauthorized',
    '/main-dev.js',
    '/main-dev.css',
    '/assets/images/favicon.ico',
    '/assets/manifest.json',
  ];

  private authService = new AuthService(config);

  public enableFor(server: Application): void {
    const loginUrl: string = config.get('services.idam-api.authorizationURL');
    const clientId: string = config.get('services.idam-api.clientID');
    const redirectUri: string = config.get('services.idam-api.callbackURL');
    const sessionCookieMaxAgeMinutes: number = config.get('session.cookieMaxAge');
    const sessionCookieMaxAgeMs = sessionCookieMaxAgeMinutes * 60 * 1000;

    server.get('/login', (req: AppRequest, res) => {
      res.redirect(loginUrl + '?client_id=' + clientId + '&response_type=code&redirect_uri=' + encodeURI(redirectUri));
    });

    server.get('/oauth2/callback', async (req: AppRequest, res: Response) => {
      try {
        await this.authService.getIdAMToken(IdamGrantType.AUTH_CODE, req.session, req.query.code as string);

        await this.terminateOtherSessions(req, sessionCookieMaxAgeMs);

        return res.redirect('/');
      } catch (error) {
        return errorRedirect(res, (error as AppError).code);
      }
    });

    server.get('/logout', async (req: AppRequest, res) => {
      await this.clearSessionMapping(req);

      req.session.user = undefined;

      req.session.destroy((err) => {
        if (err) {
          console.log('Error clearing session:', err);
        }
        // Redirect the user to the login page
        res.redirect('/');
      });
    });

    server.use((req: AppRequest, res: Response, next: NextFunction) => {
      if (this.nonProtectedUrls.includes(req.path) || OidcMiddleware.isMainFile(req.path) || !config.get('services.idam-api.enabled')) return next();

      if (req.session.user) {
        // Verify the user has one fo the approved roles
        const roles = req.session.user?.roles;
        if (roles && roles.some(role => this.approvedRoles.includes(role))) {
          res.locals.isLoggedIn = true;
          res.locals.userRoles = roles;

          return next();
        }

        return res.redirect('/unauthorized');
      }
      res.redirect('/login');
    });
  }

  private static isMainFile(path: string): boolean {
    const js = /\/main\.([a-zA-Z]*[0-9]*[a-zA-Z]*)+\.js/gm;
    const css = /\/main\.([a-zA-Z]*[0-9]*[a-zA-Z]*)+\.css/gm;

    return js.test(path) || css.test(path);
  }

  private getUserSessionKey(userId: string): string {
    return `user-session:${userId}`;
  }

  private async terminateOtherSessions(req: AppRequest, ttlMs: number): Promise<void> {
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

  private async clearSessionMapping(req: AppRequest): Promise<void> {
    const userId = req.session.user?.id;
    const redisClient = req.app.locals.redisClient as Redis | undefined;

    if (!userId || !redisClient) return;
    const key = this.getUserSessionKey(userId);
    await redisClient.del(key);
  }

}
