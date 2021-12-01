import fetch from 'node-fetch';
import { formatQueryString } from '../util/Url';
import { get } from 'config';
// @ts-ignore (No declaration file)
import { Logger } from '@hmcts/nodejs-logging';
import { Request } from 'express';

const completeRedirectURI = (uri: string) => {
  if (!uri.startsWith('http')) {
    return `https://${uri}`;
  }
  return uri;
};

export function accessTokenRequest(request: Request): Promise<Response> {

  const options = {
    headers: {
      'Authorization': 'Basic '
        + Buffer.from(get('idam.oauth2.client_id') + ':' + get('secrets.ccd.ccd-admin-web-oauth2-client-secret'))
          .toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
  };
  const params = {
    code: request.query.code,
    grant_type: 'authorization_code',
    redirect_uri: completeRedirectURI(request.query.redirect_uri as string),
  };
  const logger = Logger.getLogger(__filename);
  return fetch(get('idam.oauth2.token_endpoint') + formatQueryString(params), options)
    .then((response) =>
      response.status === 200 ? response : response.text().then((text) => Promise.reject(new Error(text))))
    .then(async (response) => await response.json() as Response)
    .catch((error) => {
      logger.error('Failed to obtain access token:', error);
      throw error;
    });
}
