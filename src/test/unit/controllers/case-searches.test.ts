import nock from 'nock';
import sinon from 'sinon';
import {CaseSearchRequest} from '../../../main/models/case/CaseSearchRequest';
import {AppRequest, LogData} from '../../../main/models/appRequest';
import caseSearchLogs from '../../data/caseSearchLogs.json';
import {Response} from 'express';
import {CaseSearchesController} from '../../../main/controllers/CaseSearches.controller';
import {CaseSearchLog} from '../../../main/models/case/CaseSearchLogs';
import {CaseSearchAudit} from '../../../main/models/case/CaseSearchAudit';

describe('Case Searches Controller', () => {
  const caseSearchesController = new CaseSearchesController();

  describe('getLogData', () => {
    it('returns valid log data - no search logs', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseSearch?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          {searchLog: [], totalNumberOfRecords: 0, startRecordNumber: 1, moreRecords: false},
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
          user: {idToken: ''},
        },
      };

      return caseSearchesController.getLogData(req as AppRequest).then((caseSearches: LogData) => {
        const expectCaseSearches: LogData = {
          hasData: false,
          moreRecords: false,
          rows: [],
          startRecordNumber: 1,
          noOfRows: 0,
          totalNumberOfRecords: 0,
          currentPage: 1,
          lastPage: 1,
        };
        expect(caseSearches).toStrictEqual(expectCaseSearches);
        nock.cleanAll();
      });
    });

    it('returns valid log data - with search logs <= 12', async () => {
      const caseSearchLogs: CaseSearchLog[] = [
        {
          'userId': 'U0001',
          'caseRefs': ['123','456'],
          'timestamp': '2020-07-20 15:00:00',
        },
        {
          'userId': 'U0002',
          'caseRefs': [],
          'timestamp': '2020-07-20 15:00:00',
        },
      ];

      const caseSearchAudit: CaseSearchAudit = {
        searchLog: caseSearchLogs,
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 2,
      };

      nock('http://localhost:4550')
        .get('/audit/caseSearch?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          caseSearchAudit,
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
          user: {idToken: ''},
        },
      };

      return caseSearchesController.getLogData(req as AppRequest).then((caseSearches: LogData) => {
        const expectCaseSearches: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{text: 'U0001'}, {text: '123, 456'}, {text: '2020-07-20 15:00:00'}],
            [{text: 'U0002'}, {text: ''}, {text: '2020-07-20 15:00:00'}],
          ],
          startRecordNumber: 1,
          noOfRows: 2,
          totalNumberOfRecords: 2,
          currentPage: 1,
          lastPage: 1,
        };
        // Add `classes: 'overflow-wrap'` to all cells in rows
        expectCaseSearches.rows.forEach(row => row.forEach(cell => cell.classes = 'overflow-wrap'));

        expect(caseSearches).toStrictEqual(expectCaseSearches);
        nock.cleanAll();
      });
    });

    it('returns valid log data - with search logs > 12', async () => {
      const caseSearchAudit: CaseSearchAudit = {
        searchLog: caseSearchLogs.searchLog as CaseSearchLog[],
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 14,
      };

      nock('http://localhost:4550')
        .get('/audit/caseSearch?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          caseSearchAudit,
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
          user: {idToken: ''},
        },
      };

      return caseSearchesController.getLogData(req as AppRequest).then((caseSearches: LogData) => {
        const expectCaseSearches: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{'text': 'U0001'}, {'text': '123, 456', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0002'}, {'text': '', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0003'}, {'text': '', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0004'}, {'text': '123, 456', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0005'}, {'text': '123, 456', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0006'}, {'text': '123, 456', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0007'}, {'text': '123, 456', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0008'}, {'text': '123, 456', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0009'}, {'text': '123, 456', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0010'}, {'text': '123, 456', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0011'}, {'text': '123, 456', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0012'}, {'text': '123, 456', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0013'}, {'text': '123, 456', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
            [{'text': 'U0014'}, {'text': '123, 456', 'classes': 'overflow-wrap'}, {'text': '2020-07-20 15:00:00'}],
          ],
          startRecordNumber: 1,
          noOfRows: 14,
          totalNumberOfRecords: 14,
          currentPage: 1,
          lastPage: 3,
        };
        // Add `classes: 'overflow-wrap'` to all cells in rows
        expectCaseSearches.rows.forEach(row => row.forEach(cell => cell.classes = 'overflow-wrap'));

        expect(caseSearches).toStrictEqual(expectCaseSearches);
        nock.cleanAll();
      });
    });

    it('returns null if neither user id or case ref are provided', () => {
      const searchRequest: Partial<CaseSearchRequest> = {
        caseJurisdictionId: 'probate',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          caseFormState: searchRequest,
          user: {idToken: ''},
        },
      };

      return caseSearchesController.getLogData(req as AppRequest).then((caseSearches: LogData) => {
        expect(caseSearches).toStrictEqual(null);
      });
    });
  });

  describe('getPage', () => {
    it('repeats the search using same criteria with new page number', async () => {
      const caseSearchAudit: CaseSearchAudit = {
        searchLog: caseSearchLogs.searchLog as CaseSearchLog[],
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 0,
      };

      nock('http://localhost:4550')
        .get('/audit/caseSearch?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          caseSearchAudit,
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

      const res = { redirect: sinon.spy() };

      // @ts-ignore Conversion of res with spy
      return caseSearchesController.getPage(appRequest as AppRequest, res as Response).then(() => {
        expect(appRequest.session.caseFormState.page).toBe(2);
        expect(res.redirect.calledOnce).toBeTruthy();
      });
    });
  });
});
