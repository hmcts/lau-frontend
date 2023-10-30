import {LoggerInstance} from 'winston';
import config from 'config';
import totp from 'totp-generator';
import {ServiceAuthToken} from '../components/idam/ServiceAuthToken';
import fetch, {Response as FetchResponse} from 'node-fetch';
import {jwtDecode} from 'jwt-decode';
import {AppSession, UserDetails} from '../models/appRequest';
import {HttpResponseError} from '../util/HttpResponseError';
import {AppError, ErrorCode} from '../models/AppError';

const {Logger} = require('@hmcts/nodejs-logging');

export interface IdTokenJwtPayload {
  uid: string;
  sub: string;
  given_name: string;
  family_name: string;
  roles: string[];
}

export interface IdamResponseData {
  access_token: string;
  refresh_token: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}

export enum IdamGrantType {AUTH_CODE = 'authorization_code', REFRESH = 'refresh_token'}

export class AuthService {
  private logger: LoggerInstance = Logger.getLogger('AuthService');

  private clientId: string = config.get('services.idam-api.clientID');
  private clientSecret: string = config.get('services.idam-api.clientSecret');
  private redirectUri: string = config.get('services.idam-api.callbackURL');
  private tokenUrl: string = String(config.get('services.idam-api.url')) + String(config.get('services.idam-api.endpoints.token'));
  private microserviceName = 'lau_frontend';
  private s2sUrl: string = config.get('services.s2s.url');
  private totpSecret: string = config.get('services.s2s.lauSecret');

  retrieveServiceToken(): Promise<ServiceAuthToken> {
    const params = {
      microservice: this.microserviceName,
      oneTimePassword: totp(this.totpSecret),
    };

    return new Promise((resolve, reject) => {
      fetch(
        this.s2sUrl + '/lease',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        },
      )
        .then((res: FetchResponse) => res.text())
        .then((token: string) => {
          this.logger.info('Token: ', token);
          resolve(new ServiceAuthToken(token));
        })
        .catch((err: string) => {
          this.logger.error(err);
          reject(new AppError(err, ErrorCode.S2S));
        });
    });
  }

  async getIdAMToken(grantType: IdamGrantType, session: AppSession, authCode?: string): Promise<UserDetails> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const requestTimeInSeconds = Math.round(Date.now() / 1000);

      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: grantType,
        redirect_uri: this.redirectUri,
      });

      if (grantType === IdamGrantType.AUTH_CODE) {
        params.set('code', authCode);
      } else {
        params.set('refresh_token', session.user.refreshToken);
      }

      let response: FetchResponse;
      try {
        response = await fetch(
          this.tokenUrl,
          {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          },
        );
      } catch (err) {
        this.logger.error(err);
        return reject(new AppError(err, ErrorCode.IDAM_API));
      }

      try {
        AuthService.checkStatus(response);
      } catch (error) {
        this.logger.error(error);

        const errorBody = error.response ? await error.response.text() : error;
        this.logger.error(`Error body: ${errorBody}`);
        return reject(new AppError(error, ErrorCode.IDAM_API));
      }

      const data: IdamResponseData = await response.json();
      const expiresAt: number = requestTimeInSeconds + Number(data.expires_in);

      const jwt: IdTokenJwtPayload = jwtDecode(data.id_token);

      session.user = {
        accessToken: data.access_token,
        expiresAt,
        refreshToken: data.refresh_token,
        idToken: data.id_token,
        id: jwt.uid,
        roles: jwt.roles,
      };
      session.save(() => resolve(session.user));
    });
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
