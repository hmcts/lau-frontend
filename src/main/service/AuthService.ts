import { IConfig } from 'config';
import {TOTP} from 'totp-generator';
import {ServiceAuthToken} from '../components/idam/ServiceAuthToken';
import {jwtDecode} from 'jwt-decode';
import {AppSession, UserDetails} from '../models/appRequest';
import {HttpResponseError} from '../util/HttpResponseError';
import {AppError, ErrorCode} from '../models/AppError';

import logger from '../modules/logging';

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

export interface IdamRequestExtraParams {
  code?: string;
  refresh_token?: string;
  scope?: string;
  username?: string;
  password?: string;
}

export enum IdamGrantType {
  AUTH_CODE = 'authorization_code',
  REFRESH = 'refresh_token',
  PASSWORD = 'password',
}

export class AuthService {

  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private tokenUrl: string;
  private microserviceName: string;
  private s2sUrl: string;
  private totpSecret: string;

  constructor(
    private config: IConfig,
  ) {
    this.clientId = this.config.get('services.idam-api.clientID');
    this.clientSecret = this.config.get('services.idam-api.clientSecret');
    this.redirectUri = this.config.get('services.idam-api.callbackURL');
    this.tokenUrl = `${this.config.get('services.idam-api.url')}${this.config.get('services.idam-api.endpoints.token')}`;
    this.microserviceName = 'lau_frontend';
    this.s2sUrl = this.config.get('services.s2s.url');
    this.totpSecret = this.config.get('services.s2s.lauSecret');
  }

  async retrieveServiceToken(serviceName?: string): Promise<ServiceAuthToken> {
    const { otp } = await TOTP.generate(this.totpSecret);
    const params = {
      microservice: serviceName ?? this.microserviceName,
      oneTimePassword: otp,
    };

    try {
      const response = await fetch(`${this.s2sUrl}/lease`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const token = await response.text();
      return new ServiceAuthToken(token);
    } catch (err) {
      logger.error(err);
      throw new AppError(err instanceof Error ? err.message : String(err), ErrorCode.S2S);
    }
  }

  async getIdAMResponse(grantType: IdamGrantType, extraParams: IdamRequestExtraParams): Promise<Response> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: grantType,
      redirect_uri: this.redirectUri,
      ...extraParams,
    });

    let response: Response;

    try {
      response = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
    } catch (err) {
      logger.error(err);
      throw new AppError(err instanceof Error ? err.message : String(err), ErrorCode.IDAM_API);
    }

    try {
      AuthService.checkStatus(response);
    } catch (err) {
      logger.error(err);
      const errorBody = err.response ? await err.response.text() : err;
      logger.error(`Error body: ${errorBody}`);
      throw new AppError(err, ErrorCode.IDAM_API);
    }
    return response;
  }

  async getIdAMToken(grantType: IdamGrantType, session: AppSession, authCode?: string): Promise<UserDetails> {
    const requestTimeInSeconds = Math.round(Date.now() / 1000);
    const extraParams: IdamRequestExtraParams = {};
    if (grantType === IdamGrantType.AUTH_CODE) {
      extraParams['code'] = authCode;
    } else {
      extraParams['refresh_token'] = session.user.refreshToken;
    }

    const response: Response = await this.getIdAMResponse(grantType, extraParams);
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
    session.save(() => session.user);
    return session.user;
  }


  private static checkStatus(response: Response): Response {
    if (response.ok) {
      // response.status >= 200 && response.status < 300
      return response;
    } else {
      throw new HttpResponseError(response);
    }
  }
}
