import {AuthService, IdamGrantType} from '../../service/AuthService';
import {Application, NextFunction, Response} from 'express';
import config from 'config';
import {AppRequest} from '../../models/appRequest';

/**
 * Adds the oidc middleware to add oauth authentication
 */
export class OidcMiddleware {

  private nonProtectedUrls = [
    '/unauthorized',
    '/main-dev.js',
    '/main-dev.css',
    '/assets/css/flatpickr.min.css',
    '/assets/js/flatpickr.min.js',
    '/assets/images/favicon.ico',
  ];

  private authService = new AuthService();

  public enableFor(server: Application): void {
    const loginUrl: string = config.get('services.idam.authorizationURL');
    const clientId: string = config.get('services.idam.clientID');
    const redirectUri: string = config.get('services.idam.callbackURL');

    server.get('/login', (req: AppRequest, res) => {
      res.redirect(loginUrl + '?client_id=' + clientId + '&response_type=code&redirect_uri=' + encodeURI(redirectUri));
    });

    server.get('/oauth2/callback', async (req: AppRequest, res: Response) => {
      this.authService.getIdAMToken(IdamGrantType.AUTH_CODE, req.session, req.query.code as string)
        .then(() => res.redirect('/'))
        .catch(() => res.redirect('/'));
    });

    server.get('/logout', (req: AppRequest, res) => {
      req.session.user = undefined;
      req.session.save(() => res.redirect('/'));
    });

    server.use((req: AppRequest, res: Response, next: NextFunction) => {
      if (this.nonProtectedUrls.includes(req.path) || OidcMiddleware.isMainFile(req.path) || !config.get('services.idam.enabled')) return next();

      if (req.session.user) {
        // Verify the user has the cft-audit-investigator role
        const roles = req.session.user?.roles;
        if (roles && roles.includes('cft-audit-investigator')) {
          res.locals.isLoggedIn = true;
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
