import nock from 'nock';
import sinon from 'sinon';
import {CaseSearchRequest} from '../../../main/models/case/CaseSearchRequest';
import {CaseActivityController} from '../../../main/controllers/CaseActivity.controller';
import {AppRequest, LogData} from '../../../main/models/appRequest';
import {CaseActivityLog} from '../../../main/models/case/CaseActivityLogs';
import {CaseActivityAudit} from '../../../main/models/case/CaseActivityAudit';
import caseActivityLogs from '../../data/caseActivityLogs.json';
import {Response} from 'express';
import {AppError, ErrorCode} from '../../../main/models/AppError';

describe('Case Activity Controller', () => {
  const caseActivityController = new CaseActivityController();

  describe('getLogData', () => {
    it('returns valid log data - no actions', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseAction?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          {actionLog: [], totalNumberOfRecords: 0, startRecordNumber: 1, moreRecords: false},
        );

      const searchRequest: Partial<CaseSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          caseFormState: searchRequest,
        },
      };

      return caseActivityController.getLogData(req as AppRequest).then((caseActivities: LogData) => {
        const expectCaseActivities: LogData = {
          hasData: false,
          moreRecords: false,
          rows: [],
          startRecordNumber: 1,
          noOfRows: 0,
          totalNumberOfRecords: 0,
          currentPage: 1,
          lastPage: 1,
        };
        expect(caseActivities).toStrictEqual(expectCaseActivities);
        nock.cleanAll();
      });
    });

    it('returns valid log data - with actions <= 12', async () => {
      const caseActivityLogs: CaseActivityLog[] = [
        {
          'userId': 'U0001',
          'caseAction': 'VIEW',
          'caseRef': 'C0001',
          'caseJurisdictionId': 'DIVORCE',
          'caseTypeId': 'FinancialRemedyMVP2',
          'timestamp': '2020-07-20 15:00:00',
        },
        {
          'userId': 'U0002',
          'caseAction': 'VIEW',
          'caseRef': 'C0001',
          'caseJurisdictionId': 'DIVORCE',
          'caseTypeId': 'FinancialRemedyMVP2',
          'timestamp': '2020-07-20 15:00:00',
        },
      ];

      const caseActivityAudit: CaseActivityAudit = {
        actionLog: caseActivityLogs,
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 2,
      };

      nock('http://localhost:4550')
        .get('/audit/caseAction?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          caseActivityAudit,
        );

      const searchRequest: Partial<CaseSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          caseFormState: searchRequest,
        },
      };

      return caseActivityController.getLogData(req as AppRequest).then((caseActivities: LogData) => {
        const expectCaseActivities: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{text: 'U0001'}, {text: 'VIEW'}, {text: 'C0001'}, {text: 'DIVORCE'}, {text: 'FinancialRemedyMVP2'}, {text: '2020-07-20 15:00:00'}],
            [{text: 'U0002'}, {text: 'VIEW'}, {text: 'C0001'}, {text: 'DIVORCE'}, {text: 'FinancialRemedyMVP2'}, {text: '2020-07-20 15:00:00'}],
          ],
          startRecordNumber: 1,
          noOfRows: 2,
          totalNumberOfRecords: 2,
          currentPage: 1,
          lastPage: 1,
        };
        // Add `classes: 'overflow-wrap'` to all cells in rows
        expectCaseActivities.rows.forEach(row => row.forEach(cell => cell.classes = 'overflow-wrap'));

        expect(caseActivities).toStrictEqual(expectCaseActivities);
        nock.cleanAll();
      });
    });

    it('returns valid log data - with actions > 12', async () => {
      const caseActivityAudit: CaseActivityAudit = {
        actionLog: caseActivityLogs.actionLog as CaseActivityLog[],
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 14,
      };

      nock('http://localhost:4550')
        .get('/audit/caseAction?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          caseActivityAudit,
        );

      const searchRequest: Partial<CaseSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          caseFormState: searchRequest,
        },
      };

      return caseActivityController.getLogData(req as AppRequest).then((caseActivities: LogData) => {
        const expectCaseActivities: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{'text': 'U0001'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0002'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0003'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0004'}, {'text': 'Create'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0005'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0006'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0007'}, {'text': 'Update'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0008'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0009'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0010'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0011'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0012'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0013'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0014'}, {'text': 'VIEW'}, {'text': 'C0001'}, {'text': 'DIVORCE'}, {'text': 'FinancialRemedyMVP2'}, {'text': '2020-07-20 15:00:00'}],
          ],
          startRecordNumber: 1,
          noOfRows: 14,
          totalNumberOfRecords: 14,
          currentPage: 1,
          lastPage: 3,
        };
        // Add `classes: 'overflow-wrap'` to all cells in rows
        expectCaseActivities.rows.forEach(row => row.forEach(cell => cell.classes = 'overflow-wrap'));

        expect(caseActivities).toStrictEqual(expectCaseActivities);
        nock.cleanAll();
      });
    });

    it('returns app error if no log data is returned', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseAction?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(200, {});

      const searchRequest: Partial<CaseSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          caseFormState: searchRequest,
        },
      };

      return caseActivityController.getLogData(req as AppRequest).catch((error: AppError) => {
        expect(error.message).toBe('Case Activities data malformed');
        expect(error.code).toBe(ErrorCode.CASE_BACKEND);
        nock.cleanAll();
      });
    });
  });

  describe('getPage', () => {
    it('repeats the search using same criteria with new page number', async () => {
      const caseActivityAudit: CaseActivityAudit = {
        actionLog: caseActivityLogs.actionLog as CaseActivityLog[],
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 0,
      };

      nock('http://localhost:4550')
        .get('/audit/caseAction?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=2')
        .reply(
          200,
          caseActivityAudit,
        );

      const appRequest = {
        session: {
          caseFormState: {
            userId: '123',
            startTimestamp: '2021-12-12T12:00:00',
            endTimestamp: '2021-12-12T12:00:01',
            page: 1,
          },
        },
        params: {
          pageNumber: 2,
        },
      };

      const res = {redirect: sinon.spy()};

      // @ts-ignore Conversion of res with spy
      return caseActivityController.getPage(appRequest as AppRequest, res as Response).then(() => {
        expect(appRequest.session.caseFormState.page).toBe(2);
        expect(res.redirect.calledOnce).toBeTruthy();
      });
    });

    it('redirects to error page with code on fetch failure', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseAction?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=2')
        .reply(
          200,
          {},
        );

      const appRequest = {
        session: {
          caseFormState: {
            userId: '123',
            startTimestamp: '2021-12-12T12:00:00',
            endTimestamp: '2021-12-12T12:00:01',
            page: 1,
          },
        },
        params: {
          pageNumber: 2,
        },
      };

      const res = {redirect: sinon.spy()};

      // @ts-ignore Conversion of res with spy
      return caseActivityController.getPage(appRequest as AppRequest, res as Response).then(() => {
        expect(res.redirect.calledOnce).toBeTruthy();
        expect(res.redirect.calledWith('/error?code=LAU02')).toBeTruthy();
        nock.cleanAll();
      });
    });
  });
});
