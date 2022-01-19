import nock from 'nock';
import jwt_decode from 'jwt-decode';
import {AuthService} from '../../../main/service/AuthService';
import {BearerToken, ServiceAuthToken} from '../../../main/idam/ServiceAuthToken';

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
});
