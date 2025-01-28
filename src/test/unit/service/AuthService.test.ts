import nock from 'nock';
import config from 'config';
import {jwtDecode} from 'jwt-decode';
import {AuthService, IdamGrantType, IdamResponseData} from '../../../main/service/AuthService';
import {BearerToken, ServiceAuthToken} from '../../../main/components/idam/ServiceAuthToken';
import {AppSession, UserDetails} from '../../../main/models/appRequest';
import {AppError, ErrorCode} from '../../../main/models/AppError';

describe('AuthService', () => {

  const authService = new AuthService(config);

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
      const bearerToken: BearerToken = jwtDecode(returnedToken.bearerToken);
      expect(bearerToken.sub).toBe('lau_frontend');
      expect(bearerToken.exp).toBe(1634657845);
      expect(returnedToken.expired).toBeTruthy();
    });

    it('calls api with given service name', async () => {
      let parsedBody = {microservice: ''};
      nock('http://localhost:4552')
        .post('/lease', function(body) {
          parsedBody = body;
          return body;
        })
        .reply(
          200,
          serviceToken,
        );

      await authService.retrieveServiceToken('ccd_data');
      expect(parsedBody.microservice).toBe('ccd_data');
    });

    it('returns app error code on lease fetch failure', async () => {
      nock('http://localhost:4552')
        .post('/lease')
        .replyWithError('test error');

      return authService.retrieveServiceToken().catch((err: AppError) => {
        expect(err.message).toContain('test error');
        expect(err.code).toBe(ErrorCode.S2S);
      });
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

      nock(config.get('services.idam-api.url'))
        .post(config.get('services.idam-api.endpoints.token'))
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
        toggleablePages: {'lau-challenged-access': true},
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

      nock(config.get('services.idam-api.url'))
        .post(config.get('services.idam-api.endpoints.token'))
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
        toggleablePages: {'lau-challenged-access': true},
      };
      expect(userDetails).toStrictEqual(expectedUser);

      // Potential for race condition with expiry time, allowing for a tolerance of 3 seconds.
      const expectedExpire = 123 + Math.round(Date.now() / 1000);
      expect((expectedExpire - 3) < userDetails.expiresAt && userDetails.expiresAt < (expectedExpire + 3)).toBeTruthy();
    });

    it('returns app error code on fetch failure', async () => {
      nock(config.get('services.idam-api.url'))
        .post(config.get('services.idam-api.endpoints.token'))
        .replyWithError('test error');

      const session = {
        save: (callback: () => void) => callback(),
      };

      return authService.getIdAMToken(IdamGrantType.AUTH_CODE, session as AppSession).catch((err: AppError) => {
        expect(err.message).toContain('test error');
        expect(err.code).toBe(ErrorCode.IDAM_API);
      });
    });

    it('returns error on fetch status failure', async () => {
      nock(config.get('services.idam-api.url'))
        .post(config.get('services.idam-api.endpoints.token'))
        .reply(500, {});

      const session = {
        save: (callback: () => void) => callback(),
      };

      return authService.getIdAMToken(IdamGrantType.AUTH_CODE, session as AppSession).catch((err: AppError) => {
        expect(err.message).toContain('HTTP Error Response');
        expect(err.code).toBe(ErrorCode.IDAM_API);
      });
    });

  });
});
