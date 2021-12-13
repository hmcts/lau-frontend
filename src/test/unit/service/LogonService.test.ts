import nock from 'nock';
import config from 'config';
import {LogonService} from '../../../main/service/LogonService';
import {LogonAudit} from '../../../main/models/idam/LogonAudit';
import {LogonSearchRequest} from '../../../main/models/idam/LogonSearchRequest';
import {AppRequest} from '../../../main/models/appRequest';

describe('Logon Service', () => {
  const logonService = new LogonService();
  const baseApiUrl = config.get('services.idam-backend.url') as string;

  describe('getLogons', () => {
    const logonEndpoint = config.get('services.idam-backend.endpoints.logon') as string;

    it('return logon audit data', async () => {
      const logonAudit: LogonAudit = {
        logonLog: [],
        totalNumberOfRecords: 0,
        startRecordNumber: 1,
        moreRecords: false,
      };

      nock(baseApiUrl)
        .get(`${logonEndpoint}?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01`)
        .reply(
          200,
          logonAudit,
        );

      const searchParameters: Partial<LogonSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
      };

      const req = {
        session: {
          logonFormState: searchParameters,
        },
      };

      const logons: LogonAudit = await logonService.getLogons(req as AppRequest);

      expect(logons).toStrictEqual(logonAudit);
    });
  });
});
