import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import config from 'config';
import fetch, {Response as FetchResponse} from 'node-fetch';
import {AuthService, LauServiceName} from './AuthService';
import {UserDetails} from '../models/appRequest';

export abstract class BaseService<RequestType> {
  abstract baseApiUrl: string;
  // TODO Remove once LAU-227 completed
  abstract serviceName: LauServiceName;

  private logger: LoggerInstance = Logger.getLogger(this.constructor.name);

  private authService = new AuthService();
  private s2sEnabled: string = config.get('services.idam.s2sEnabled');

  async get(userDetails: UserDetails, endpoint: string, qs?: string): Promise<unknown> {
    const s2sToken = this.s2sEnabled ? await this.authService.retrieveServiceToken(this.serviceName) : {bearerToken: ''};
    const headers = {
      'Content-Type': 'application/json',
      'ServiceAuthorization': 'Bearer ' + s2sToken.bearerToken,
      'Authorization': 'Bearer ' + userDetails?.accessToken || '',
    };
    this.logger.info('Headers:');
    this.logger.info(JSON.stringify(headers));
    const response: FetchResponse = await fetch(
      `${this.baseApiUrl}${endpoint}${qs || ''}`,
      {
        method: 'GET',
        headers,
      },
    ).catch(err => {
      this.logger.error(err);
      return err;
    });

    return response.json();
  }

  getQueryString(params: Partial<RequestType>): string {
    return '?' + Object.keys(params)
      // @ts-ignore
      .map(key => key + '=' + encodeURIComponent(params[key]))
      .join('&');
  }
}
