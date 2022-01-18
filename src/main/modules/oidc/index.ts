const logger = (require('@hmcts/nodejs-logging')).Logger.getLogger('oidc');

import {Application, NextFunction, Response} from 'express';
import fetch, {Response as FetchResponse} from 'node-fetch';
import config from 'config';
import jwt_decode from 'jwt-decode';
import {AppRequest} from '../../models/appRequest';
import {HttpResponseError} from '../../util/HttpResponseError';

interface IdTokenJwtPayload {
  uid: string;
  sub: string;
  given_name: string;
  family_name: string;
  roles: string[];
}

interface IdamResponseData {
  access_token: string;
  refresh_token: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

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

  public enableFor(server: Application): void {
    const loginUrl: string = config.get('services.idam.authorizationURL');
    const tokenUrl: string = config.get('services.idam.tokenURL');
    const clientId: string = config.get('services.idam.clientID');
    const clientSecret: string = config.get('services.idam.clientSecret');
    const redirectUri: string = config.get('services.idam.callbackURL');

    server.get('/login', (req: AppRequest, res) => {
      res.redirect(loginUrl + '?client_id=' + clientId + '&response_type=code&redirect_uri=' + encodeURI(redirectUri));
    });

    server.get('/oauth2/callback', async (req: AppRequest, res: Response) => {

      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: req.query.code as string,
      });

      let response: FetchResponse;
      try {
        response = await fetch(
          tokenUrl,
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          },
        );
      } catch (e) {
        logger.error(e);
        return res.redirect('/');
      }

      try {
        OidcMiddleware.checkStatus(response);
      } catch (error) {
        logger.error(error);

        const errorBody = await error.response.text();
        logger.error(`Error body: ${errorBody}`);
        return res.redirect('/');
      }

      const data: IdamResponseData = await response.json();
      const jwt: IdTokenJwtPayload = jwt_decode(data.id_token);

      req.session.user = {
        accessToken: data.access_token,
        idToken: data.id_token,
        id: jwt.uid,
        roles: jwt.roles,
      };
      req.session.save(() => res.redirect('/'));
    });

    server.get('/logout', function (req: AppRequest, res) {
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

  private static checkStatus(response: FetchResponse): FetchResponse {
    if (response.ok) {
      // response.status >= 200 && response.status < 300
      return response;
    } else {
      throw new HttpResponseError(response);
    }
  }

}
