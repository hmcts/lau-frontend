import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import fetch, {Response as FetchResponse} from 'node-fetch';
import config from 'config';
import {CaseActivityAudit} from '../models/case/CaseActivityAudit';
import {CaseSearchRequest} from '../models/case/CaseSearchRequest';
import {AuthService} from './AuthService';
import {CaseSearchAudit} from '../models/case/CaseSearchAudit';
import {AppRequest, UserDetails} from '../models/appRequest';

export class CaseService {
  private logger: LoggerInstance = Logger.getLogger('CaseService');

  private baseApiUrl = config.get('services.case-backend.url');
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
          'Authorization': 'Bearer ' + userDetails?.accessToken || '',
        },
      },
    ).catch(err => {
      this.logger.error(err);
      return err;
    });

    return response.json();
  }

  private getQueryString(params: Partial<CaseSearchRequest>): string {
    return '?' + Object.keys(params)
      // @ts-ignore
      .map(key => key + '=' + encodeURIComponent(params[key]))
      .join('&');
  }

  public getCaseActivities(req: AppRequest): Promise<CaseActivityAudit> {
    const endpoint: string = config.get('services.case-backend.endpoints.caseActivity');
    const searchParameters = req.session.caseFormState || {};
    return this.get(req.session.user, endpoint, this.getQueryString(searchParameters)) as Promise<CaseActivityAudit>;
  }

  public getCaseSearches(req: AppRequest): Promise<CaseSearchAudit> {
    const endpoint: string = config.get('services.case-backend.endpoints.caseSearch');
    const searchParameters = req.session.caseFormState || {};
    return this.get(req.session.user, endpoint, this.getQueryString(searchParameters)) as Promise<CaseSearchAudit>;
  }

}
