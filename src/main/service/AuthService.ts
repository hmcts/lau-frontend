import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import config from 'config';
import totp from 'totp-generator';
import {ServiceAuthToken} from '../components/idam/ServiceAuthToken';
import fetch, {Response as FetchResponse} from 'node-fetch';
import jwt_decode from 'jwt-decode';
import {AppSession, UserDetails} from '../models/appRequest';
import {HttpResponseError} from '../util/HttpResponseError';

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

  private clientId: string = config.get('services.idam.clientID');
  private clientSecret: string = config.get('services.idam.clientSecret');
  private redirectUri: string = config.get('services.idam.callbackURL');
  private tokenUrl: string = config.get('services.idam.tokenURL');
  private microserviceName = 'lau_frontend';
  private s2sUrl: string = config.get('services.idam.s2sURL');
  private totpSecret: string = config.get('services.idam.s2sSecretLAU');

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
        .then(res => res.text())
        .then(token => {
          this.logger.info('Token: ', token);
          resolve(new ServiceAuthToken(token));
        })
        .catch(err => {
          this.logger.error(err);
          reject(new Error(err));
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
      } catch (e) {
        this.logger.error(e);
        reject();
      }

      try {
        AuthService.checkStatus(response);
      } catch (error) {
        this.logger.error(error);

        const errorBody = await error.response.text();
        this.logger.error(`Error body: ${errorBody}`);
        reject();
      }

      const data: IdamResponseData = await response.json();
      const expiresAt: number = requestTimeInSeconds + Number(data.expires_in);

      const jwt: IdTokenJwtPayload = jwt_decode(data.id_token);

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
