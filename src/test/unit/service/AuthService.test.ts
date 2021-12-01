import nock from 'nock';
import jwt_decode from 'jwt-decode';
import {AuthService} from '../../../main/service/AuthService';
import {BearerToken, ServiceAuthToken} from '../../../main/idam/ServiceAuthToken';

describe('AuthService', () => {

  const authService = new AuthService();

  describe('retrieveServiceToken', () => {

    // { "sub": "lau_case_frontend", "exp": 1634657845 } (exp: 19th Oct 2021 16:37:25 GMT)
    const serviceToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsYXVfY2FzZV9mcm9udGVuZCIsImV4cCI6MTYzNDY1Nzg0NX0.U_DjKcHscgsSLGe3SYOiVivpryVZsiNeEDGVQk3pxnmdTPRE91TyrUlvJCvBFm9x4j_f29F6LBCTrnJDxtWe-g';

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
      expect(bearerToken.sub).toBe('lau_case_frontend');
      expect(bearerToken.exp).toBe(1634657845);
      expect(returnedToken.expired).toBeTruthy();
    });

  });
});
