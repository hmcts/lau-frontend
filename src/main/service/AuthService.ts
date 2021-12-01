import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import config from 'config';
import totp from 'totp-generator';
import {ServiceAuthToken} from '../idam/ServiceAuthToken';
import fetch from 'node-fetch';

const microserviceName = 'lau_case_frontend';
const s2sUrl = config.get<string>('services.idam.s2sURL');
const totpSecret = config.get<string>('services.idam.s2sSecretLAU');

export class AuthService {
  private logger: LoggerInstance = Logger.getLogger('AuthService');

  retrieveServiceToken(): Promise<ServiceAuthToken> {
    const params = {
      microservice: microserviceName,
      oneTimePassword: totp(totpSecret),
    };

    return new Promise((resolve, reject) => {
      fetch(
        s2sUrl + '/lease',
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
}
