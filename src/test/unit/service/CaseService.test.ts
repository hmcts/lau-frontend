import nock from 'nock';
import config from 'config';
import {CaseService} from '../../../main/service/CaseService';
import {CaseActivityAudit} from '../../../main/models/case/CaseActivityAudit';
import {CaseSearchRequest} from '../../../main/models/case/CaseSearchRequest';
import {CaseSearchAudit} from '../../../main/models/case/CaseSearchAudit';
import {AppRequest} from '../../../main/models/appRequest';

describe('Case Service', () => {
  const caseService = new CaseService();
  const baseApiUrl = config.get('services.case-backend.url') as string;

  describe('getCaseActivities', () => {
    const caseActivitiesEndpoint = config.get('services.case-backend.endpoints.caseActivity') as string;

    it('return case activity audit data', async () => {
      const caseActivityAudit: CaseActivityAudit = {
        actionLog: [],
        totalNumberOfRecords: 0,
        startRecordNumber: 1,
        moreRecords: false,
      };

      nock(baseApiUrl)
        .get(`${caseActivitiesEndpoint}?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01`)
        .reply(
          200,
          caseActivityAudit,
        );

      const searchParameters: Partial<CaseSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
      };

      const req = {
        session: {
          caseFormState: searchParameters,
        },
      };

      const caseActivities: CaseActivityAudit = await caseService.getCaseActivities(req as AppRequest);

      expect(caseActivities).toStrictEqual(caseActivityAudit);
    });
  });

  describe('getCaseSearches', () => {
    const caseSearchesEndpoint = config.get('services.case-backend.endpoints.caseSearch') as string;

    it('return case searches audit data', async () => {
      const caseSearchAudit: CaseSearchAudit = {
        searchLog: [],
        totalNumberOfRecords: 0,
        startRecordNumber: 1,
        moreRecords: false,
      };

      nock(baseApiUrl)
        .get(`${caseSearchesEndpoint}?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01`)
        .reply(
          200,
          caseSearchAudit,
        );

      const searchParameters: Partial<CaseSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
      };

      const req = {
        session: {
          caseFormState: searchParameters,
        },
      };

      const caseSearches: CaseSearchAudit = await caseService.getCaseSearches(req as AppRequest);

      expect(caseSearches).toStrictEqual(caseSearchAudit);
    });
  });
});
