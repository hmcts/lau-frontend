import nock from 'nock';
import config from 'config';
import jwt_decode from 'jwt-decode';
import {AuthService, IdamGrantType, IdamResponseData} from '../../../main/service/AuthService';
import {BearerToken, ServiceAuthToken} from '../../../main/components/idam/ServiceAuthToken';
import {AppSession, UserDetails} from '../../../main/models/appRequest';

describe('AuthService', () => {

  const authService = new AuthService();

  describe('retrieveServiceToken', () => {

    // { "sub": "lau_frontend", "exp": 1634657845 } (exp: 19th Oct 2021 16:37:25 GMT)
    const serviceToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsYXVfZnJvbnRlbmQiLCJleHAiOjE2MzQ2NTc4NDV9.jQGcekdBA_vLnBmo0gCs6Hwuti6cT7BFlcPVU1gtciiaV9SlIrNeNzHcuigeNGwNIrSZ3F28pjPAWi48rDr0nw';

    afterEach(() => {
      nock.cleanAll();
    });

    it('return the service token', async () => {
      nock('http://localhost:4552')
        .post('/lease')
        .reply(
          200,
          serviceToken,
        );

      const returnedToken: ServiceAuthToken = await authService.retrieveServiceToken();

      expect(returnedToken.bearerToken).toBe(serviceToken);
      const bearerToken: BearerToken = jwt_decode(returnedToken.bearerToken);
      expect(bearerToken.sub).toBe('lau_frontend');
      expect(bearerToken.exp).toBe(1634657845);
      expect(returnedToken.expired).toBeTruthy();
    });

  });

  describe('getIdAMToken', () => {

    // { "uid": "lau_id", "roles": ["cft-audit-investigator"], "sub": "lau_frontend", "exp": 1634657845 } (exp: 19th Oct 2021 16:37:25 GMT)
    const serviceToken = 'eyJhbGciOiJIUzUxMiJ9.eyJ1aWQiOiJsYXVfaWQiLCJyb2xlcyI6WyJjZnQtYXVkaXQtaW52ZXN0aWdhdG9yIl0sInN1YiI6ImxhdV9mcm9udGVuZCIsImV4cCI6MTYzNDY1Nzg0NX0.-lYVK8OETxoJsVmYqt0Pmj32s3GZ9O7J05nf9cj0wD7jjTa7ry5ybc80HfG3-TLin_fJWKfSsYLilWmiq2a-EQ';

    afterEach(() => {
      nock.cleanAll();
    });

    it('requests a new authorization code', async () => {
      const idamResponse: IdamResponseData = {
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
        scope: 'scope',
        id_token: serviceToken,
        token_type: 'tokenType',
        expires_in: 123,
      };

      nock(config.get('services.idam.tokenURL'))
        .post('')
        .reply(
          200,
          idamResponse,
        );

      const session = {
        save: (callback: () => void) => callback(),
      };

      const userDetails: UserDetails = await authService.getIdAMToken(IdamGrantType.AUTH_CODE, session as AppSession);

      const expectedUser: UserDetails = {
        accessToken: 'accessToken',
        expiresAt: userDetails.expiresAt,
        refreshToken: 'refreshToken',
        idToken: serviceToken,
        id: 'lau_id',
        roles: ['cft-audit-investigator'],
      };
      expect(userDetails).toStrictEqual(expectedUser);

      // Potential for race condition with expiry time, allowing for a tolerance of 3 seconds.
      const expectedExpire = 123 + Math.round(Date.now() / 1000);
      expect((expectedExpire - 3) < userDetails.expiresAt && userDetails.expiresAt < (expectedExpire + 3)).toBeTruthy();
    });

    it('requests a token refresh', async () => {
      const idamResponse: IdamResponseData = {
        access_token: 'accessToken',
        refresh_token: 'refreshToken',
        scope: 'scope',
        id_token: serviceToken,
        token_type: 'tokenType',
        expires_in: 123,
      };

      nock(config.get('services.idam.tokenURL'))
        .post('')
        .reply(
          200,
          idamResponse,
        );

      const session = {
        user: {
          refreshToken: 'refreshToken',
        },
        save: (callback: () => void) => callback(),
      };

      const userDetails: UserDetails = await authService.getIdAMToken(IdamGrantType.REFRESH, session as AppSession);

      const expectedUser: UserDetails = {
        accessToken: 'accessToken',
        expiresAt: userDetails.expiresAt,
        refreshToken: 'refreshToken',
        idToken: serviceToken,
        id: 'lau_id',
        roles: ['cft-audit-investigator'],
      };
      expect(userDetails).toStrictEqual(expectedUser);

      // Potential for race condition with expiry time, allowing for a tolerance of 3 seconds.
      const expectedExpire = 123 + Math.round(Date.now() / 1000);
      expect((expectedExpire - 3) < userDetails.expiresAt && userDetails.expiresAt < (expectedExpire + 3)).toBeTruthy();
    });

  });
});
