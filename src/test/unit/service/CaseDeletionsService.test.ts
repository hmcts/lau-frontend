import nock from 'nock';
import config from 'config';
import {AppRequest} from '../../../main/models/appRequest';
import {CaseDeletionsService} from '../../../main/service/CaseDeletionsService';
import {CaseDeletions} from '../../../main/models/deletions/CaseDeletions';
import {CaseDeletionsSearchRequest} from '../../../main/models/deletions/CaseDeletionsSearchRequest';

describe('Case Deletions Service', () => {
  const caseDeletionsService = new CaseDeletionsService();
  const baseApiUrl = config.get('services.lau-case-backend.url') as string;

  describe('getCaseDeletions', () => {
    const caseDeletionsEndpoint = config.get('services.lau-case-backend.endpoints.caseDeletions') as string;

    it('return case deletions data', async () => {
      const expectedCaseDeletions: CaseDeletions = {
        deletionsLog: [],
        totalNumberOfRecords: 0,
        startRecordNumber: 1,
        moreRecords: false,
      };

      nock(baseApiUrl)
        .get(`${caseDeletionsEndpoint}?caseRef=123&caseTypeId=123&caseJurisdictionId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01`)
        .reply(
          200,
          expectedCaseDeletions,
        );

      const searchParameters: Partial<CaseDeletionsSearchRequest> = {
        caseRef: '123',
        caseTypeId: '123',
        caseJurisdictionId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
      };

      const req = {
        session: {
          caseDeletionsFormState: searchParameters,
        },
      };

      const caseDeletions: CaseDeletions = await caseDeletionsService.getCaseDeletions(req as AppRequest);

      expect(caseDeletions).toStrictEqual(expectedCaseDeletions);
    });
  });
});
