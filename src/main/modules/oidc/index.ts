import {AuthService, IdamGrantType} from '../../service/AuthService';
import {Application, NextFunction, Response} from 'express';
import config from 'config';
import {AppRequest} from '../../models/appRequest';
import {AppError, errorRedirect} from '../../models/AppError';
import {SessionStorage} from '../session';

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
  private sessionStorage = new SessionStorage();

  public enableFor(server: Application): void {
    const loginUrl: string = config.get('services.idam-api.authorizationURL');
    const clientId: string = config.get('services.idam-api.clientID');
    const redirectUri: string = config.get('services.idam-api.callbackURL');
    const scope: string = config.get('services.idam-api.scope');

    server.get('/login', (req: AppRequest, res) => {
      res.redirect(`${loginUrl}?client_id=${clientId}&response_type=code&redirect_uri=${encodeURI(redirectUri)}&scope=${scope}`);
    });

    server.get('/oauth2/callback', async (req: AppRequest, res: Response) => {
      try {
        await this.authService.getIdAMToken(IdamGrantType.AUTH_CODE, req.session, req.query.code as string);

        await this.sessionStorage.terminateOtherSessions(req);

        return res.redirect('/');
      } catch (error) {
        return errorRedirect(res, (error as AppError).code);
      }
    });

    server.get('/logout', async (req: AppRequest, res) => {
      await this.sessionStorage.clearSessionMapping(req);
      const endSessionUrl: string = config.get('services.idam-api.endSessionURL');
      const postLogoutRedirect = new URL(redirectUri).origin + '/login';
      const idTokenHint = req.session.user?.idToken;

      req.session.destroy((err) => {
        if (err) {
          console.log('Error clearing session:', err);
        }

        // OIDC RP-initiated logout: end session then return to app login
        const params = new URLSearchParams({post_logout_redirect_uri: postLogoutRedirect});
        if (idTokenHint) {
          params.set('id_token_hint', idTokenHint);
        }
        res.redirect(`${endSessionUrl}?${params.toString()}`);
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
}
