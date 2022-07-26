import nock from 'nock';
import sinon from 'sinon';
import {AppRequest, LogData} from '../../../main/models/appRequest';
import caseDeletionsLogs from '../../data/caseDeletionsLogs.json';
import {Response} from 'express';
import {AppError, ErrorCode} from '../../../main/models/AppError';
import {CaseDeletionsController} from '../../../main/controllers/CaseDeletions.controller';
import {CaseDeletionsSearchRequest} from '../../../main/models/deletions/CaseDeletionsSearchRequest';
import {CaseDeletionsLog} from '../../../main/models/deletions/CaseDeletionsLogs';
import {CaseDeletions} from '../../../main/models/deletions/CaseDeletions';

describe('Case Deletions Controller', () => {
  const caseDeletionsController = new CaseDeletionsController();

  describe('getLogData', () => {
    it('returns valid log data - no deletions', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseDeletions?caseRef=123&caseTypeId=123&caseJurisdictionId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          {deletionsLog: [], totalNumberOfRecords: 0, startRecordNumber: 1, moreRecords: false},
        );

      const searchRequest: Partial<CaseDeletionsSearchRequest> = {
        caseRef: '123',
        caseTypeId: '123',
        caseJurisdictionId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          caseDeletionsFormState: searchRequest,
        },
      };

      return caseDeletionsController.getLogData(req as AppRequest).then((caseDeletions: LogData) => {
        const expectCaseDeletions: LogData = {
          hasData: false,
          moreRecords: false,
          rows: [],
          startRecordNumber: 1,
          noOfRows: 0,
          totalNumberOfRecords: 0,
          currentPage: 1,
          lastPage: 1,
        };
        expect(caseDeletions).toStrictEqual(expectCaseDeletions);
        nock.cleanAll();
      });
    });

    it('returns valid log data - with deletions <= 12', async () => {
      const caseDeletionsLogs: CaseDeletionsLog[] = [
        {
          'caseRef': '1615817621013640',
          'caseJurisdictionId': 'Probate',
          'caseTypeId': 'Caveats',
          'timestamp': '2021-06-23T22:20:05.293Z',
        },
        {
          'caseRef': '1615817621013640',
          'caseJurisdictionId': 'Probate',
          'caseTypeId': 'Caveats',
          'timestamp': '2020-02-02T08:16:27.234Z',
        },
      ];

      const caseDeletions: CaseDeletions = {
        deletionsLog: caseDeletionsLogs,
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 2,
      };

      nock('http://localhost:4550')
        .get('/audit/caseDeletions?caseRef=123&caseTypeId=123&caseJurisdictionId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          caseDeletions,
        );

      const searchRequest: Partial<CaseDeletionsSearchRequest> = {
        caseRef: '123',
        caseTypeId: '123',
        caseJurisdictionId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          caseDeletionsFormState: searchRequest,
        },
      };

      return caseDeletionsController.getLogData(req as AppRequest).then((caseDeletions: LogData) => {
        const expectDeletions: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{text: '1615817621013640'}, {text: 'Probate'}, {text: 'Caveats'}, {text: '2021-06-23 22:20:05'}],
            [{text: '1615817621013640'}, {text: 'Probate'}, {text: 'Caveats'}, {text: '2020-02-02 08:16:27'}],
          ],
          startRecordNumber: 1,
          noOfRows: 2,
          totalNumberOfRecords: 2,
          currentPage: 1,
          lastPage: 1,
        };
        // Add `classes: 'overflow-wrap'` to all cells in rows
        expectDeletions.rows.forEach(row => row.forEach(cell => cell.classes = 'overflow-wrap'));

        expect(caseDeletions).toStrictEqual(expectDeletions);
        nock.cleanAll();
      });
    });

    it('returns valid log data - with deletions > 12', async () => {
      const caseDeletions: CaseDeletions = {
        deletionsLog: caseDeletionsLogs.deletionLog as CaseDeletionsLog[],
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 14,
      };

      nock('http://localhost:4550')
        .get('/audit/caseDeletions?caseRef=123&caseTypeId=123&caseJurisdictionId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          caseDeletions,
        );

      const searchRequest: Partial<CaseDeletionsSearchRequest> = {
        caseRef: '123',
        caseTypeId: '123',
        caseJurisdictionId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          caseDeletionsFormState: searchRequest,
        },
      };

      return caseDeletionsController.getLogData(req as AppRequest).then((caseDeletions: LogData) => {
        const expectDeletions: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
            [{'text':'C0001'},{'text':'DIVORCE'},{'text':'FinancialRemedyMVP2'},{'text':'2020-07-20 15:00:00'}],
          ],
          startRecordNumber: 1,
          noOfRows: 14,
          totalNumberOfRecords: 14,
          currentPage: 1,
          lastPage: 3,
        };
        // Add `classes: 'overflow-wrap'` to all cells in rows
        expectDeletions.rows.forEach(row => row.forEach(cell => cell.classes = 'overflow-wrap'));

        expect(caseDeletions).toStrictEqual(expectDeletions);
        nock.cleanAll();
      });
    });

    it('returns app error if no log data is returned', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseDeletions?caseRef=123&caseTypeId=123&caseJurisdictionId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(200, {});

      const searchRequest: Partial<CaseDeletionsSearchRequest> = {
        caseRef: '123',
        caseTypeId: '123',
        caseJurisdictionId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          caseDeletionsFormState: searchRequest,
        },
      };

      return caseDeletionsController.getLogData(req as AppRequest).catch((error: AppError) => {
        expect(error.message).toBe('Case deletions data malformed');
        expect(error.code).toBe(ErrorCode.CASE_BACKEND);
        nock.cleanAll();
      });
    });
  });

  describe('getPage', () => {
    it('repeats the search using same criteria with new page number', async () => {
      const caseDeletions: CaseDeletions = {
        deletionsLog: caseDeletionsLogs.deletionLog as CaseDeletionsLog[],
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 0,
      };

      nock('http://localhost:4550')
        .get('/audit/caseDeletions?caseRef=123&caseTypeId=123&caseJurisdictionId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=2')
        .reply(
          200,
          caseDeletions,
        );

      const appRequest = {
        session: {
          caseDeletionsFormState: {
            caseRef: '123',
            caseTypeId: '123',
            caseJurisdictionId: '123',
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
      return caseDeletionsController.getPage(appRequest as AppRequest, res as Response).then(() => {
        expect(appRequest.session.caseDeletionsFormState.page).toBe(2);
        expect(res.redirect.calledOnce).toBeTruthy();
        nock.cleanAll();
      });
    });

    it('redirects to error page with code on fetch failure', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseDeletions?caseRef=123&caseTypeId=123&caseJurisdictionId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=2')
        .reply(200, {});

      const appRequest = {
        session: {
          caseDeletionsFormState: {
            caseRef: '123',
            caseTypeId: '123',
            caseJurisdictionId: '123',
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
      return caseDeletionsController.getPage(appRequest as AppRequest, res as Response).then(() => {
        expect(res.redirect.calledOnce).toBeTruthy();
        expect(res.redirect.calledWith('/error?code=LAU02')).toBeTruthy();
        nock.cleanAll();
      });
    });
  });
});
