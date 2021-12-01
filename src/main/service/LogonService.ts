import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import fetch, {Response as FetchResponse} from 'node-fetch';
import config from 'config';
import {LogonAudit} from '../models/idam/LogonAudit';
import {LogonSearchRequest} from '../models/idam/LogonSearchRequest';
import {AuthService} from './AuthService';
import {AppRequest, UserDetails} from '../models/appRequest';

export class LogonService {
  private logger: LoggerInstance = Logger.getLogger('LogonService');

  private baseApiUrl = config.get('services.idam-backend.url');
  private s2sEnabled = config.get('services.idam.s2sEnabled');

  private authService = new AuthService();

  private async get(userDetails: UserDetails, endpoint: string, qs?: string): Promise<unknown> {
    const s2sToken = this.s2sEnabled ? await this.authService.retrieveServiceToken() : {bearerToken: ''};
    const response: FetchResponse = await fetch(
      `${this.baseApiUrl}${endpoint}${qs || ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ServiceAuthorization': 'Bearer ' + s2sToken.bearerToken,
          'Authorization': 'Bearer ' + userDetails?.idToken || '',
        },
      },
    ).catch(err => {
      this.logger.error(err);
      return err;
    });

    return response.json();
  }

  private getQueryString(params: Partial<LogonSearchRequest>): string {
    return '?' + Object.keys(params)
      // @ts-ignore
      .map(key => key + '=' + encodeURIComponent(params[key]))
      .join('&');
  }

  public getLogons(req: AppRequest): Promise<LogonAudit> {
    const endpoint: string = config.get('services.idam-backend.endpoints.logon');
    const searchParameters = req.session.logonFormState || {};
    return this.get(req.session.user, endpoint, this.getQueryString(searchParameters)) as Promise<LogonAudit>;
  }

}
