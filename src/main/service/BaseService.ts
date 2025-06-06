import config from 'config';
import fetch from 'node-fetch';
import {AuthService, IdamGrantType} from './AuthService';
import {AppSession} from '../models/appRequest';
import {AppError, ErrorCode} from '../models/AppError';

import logger from '../modules/logging';

export abstract class BaseService<RequestType> {
  abstract baseApiUrl: string;
  abstract errorCode: ErrorCode;

  private authService: AuthService;
  private s2sEnabled: string = config.get('services.s2s.enabled');

  constructor(authService?: AuthService) {
    // Allow for Inversion of Control
    this.authService = authService || new AuthService(config);
  }

  async get(session: AppSession, endpoint: string, qs?: string): Promise<unknown> {
    if (session.user?.expiresAt < Math.round(Date.now() / 1000)) {
      // Refresh the IdAM session
      await this.authService.getIdAMToken(IdamGrantType.REFRESH, session);
    }

    const s2sToken = this.s2sEnabled ? await this.authService.retrieveServiceToken() : {bearerToken: ''};

    return new Promise((resolve, reject) => {
      fetch(
        `${this.baseApiUrl}${endpoint}${qs || ''}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ServiceAuthorization': 'Bearer ' + s2sToken.bearerToken,
            'Authorization': 'Bearer ' + session.user?.accessToken || '',
          },
        })
        .then(response => {
          resolve(response.json());
        })
        .catch(err => {
          logger.error(err);
          reject(new AppError(err, ErrorCode.CASE_BACKEND));
        });
    });
  }

  getQueryString(params: Partial<RequestType>): string {
    return '?' + Object.keys(params)
      .filter(key => key !== '_csrf')
      // @ts-ignore
      .map(key => key + '=' + encodeURIComponent(params[key]))
      .join('&');
  }
}
