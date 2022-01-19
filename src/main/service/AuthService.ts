import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import config from 'config';
import totp from 'totp-generator';
import {ServiceAuthToken} from '../idam/ServiceAuthToken';
import fetch from 'node-fetch';

export class AuthService {
  private logger: LoggerInstance = Logger.getLogger('AuthService');

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
}
