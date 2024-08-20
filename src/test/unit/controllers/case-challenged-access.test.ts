import nock from 'nock';
import sinon from 'sinon';
import {AppRequest, LogData} from '../../../main/models/appRequest';
import caseChallengedAccessLogs from '../../data/caseChallengedAccessLogs.json';
import {NextFunction, Response} from 'express';
import {AppError, ErrorCode} from '../../../main/models/AppError';
import {CaseChallengedAccessController} from '../../../main/controllers/CaseChallengedAccess.controller';
import {CaseChallengedAccessRequest} from '../../../main/models/challenged-access/CaseChallengedAccessRequest';
import {CaseChallengedAccessLog} from '../../../main/models/challenged-access/CaseChallengedAccessLogs';
import {CaseChallengedAccesses} from '../../../main/models/challenged-access/CaseChallengedAccesses';

describe('Case Challenged Access Controller', () => {
  const controller = new CaseChallengedAccessController();

  describe('getLogData', () => {

    it('returns valid log data', async () => {
      nock('http://localhost:4550')
        .get('/audit/accessRequest?caseRef=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          caseChallengedAccessLogs,
        );

      const searchRequest: Partial<CaseChallengedAccessRequest> = {
        caseRef: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          caseChallengedAccessFormState: searchRequest,
        },
      };

      return controller.getLogData(req as AppRequest).then((caseChallengedAccess: LogData) => {
        const expectcaseChallengedAccess: LogData = {
          hasData: true,
          moreRecords: false,
          rows: caseChallengedAccess.rows,
          startRecordNumber: 1,
          noOfRows: 2,
          totalNumberOfRecords: 2,
          currentPage: 1,
          lastPage: 1,
        };
        expect(caseChallengedAccess).toStrictEqual(expectcaseChallengedAccess);
        nock.cleanAll();
      });
    });

    it('returns app error if no log data is returned', async () => {
      nock('http://localhost:4550')
        .get('/audit/accessRequest?caseRef=123&startTimestamp=2021-12-12T12%3A00%3A00&endTimestamp=2021-12-12T12%3A00%3A01&page=1')
        .reply(200, { accessLog: [],  startRecordNumber: 1, moreRecords: false, totalNumberOfRecords: 0});

      const searchRequest: Partial<CaseChallengedAccessRequest> = {
        caseRef: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          caseChallengedAccessFormState: searchRequest,
        },
      };

      return controller.getLogData(req as AppRequest).catch((error: AppError) => {
        expect(error.message).toBe('Case challenged access data malformed');
        expect(error.code).toBe(ErrorCode.CASE_BACKEND);
        nock.cleanAll();
      });
    });
  });

  describe('getPage', () => {
    it('repeats the search using same criteria with new page number', async () => {
      const caseChallengedAccess: CaseChallengedAccesses = {
        accessLog: caseChallengedAccessLogs.accessLog as unknown as CaseChallengedAccessLog[],
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 0,
      };

      nock('http://localhost:4550')
        .get('/audit/accessRequest?caseRef=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=2')
        .reply(
          200,
          caseChallengedAccess,
        );

      const appRequest = {
        session: {
          caseChallengedAccessFormState: {
            caseRef: '123',
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
      return controller.getPage(appRequest as AppRequest, res as Response).then(() => {
        expect(appRequest.session.caseChallengedAccessFormState.page).toBe(2);
        expect(res.redirect.calledOnce).toBeTruthy();
        nock.cleanAll();
      });
    });

    it('redirects to error page with code on fetch failure', async () => {
      nock('http://localhost:4550')
        .get('/audit/accessRequest?caseRef=123startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=6')
        .reply(500, {});

      const appRequest = {
        session: {
          caseChallengedAccessFormState: {
            caseRef: '123',
            startTimestamp: '2021-12-12T12:00:00',
            endTimestamp: '2021-12-12T12:00:01',
            page: 6,
          },
        },
        params: {
          pageNumber: 2,
        },
      };

      const res = {
        redirect: jest.fn() as NextFunction,
      };

      // @ts-ignore Conversion of res with spy
      return controller.getPage(appRequest as AppRequest, res as Response).then(() => {
        expect(res.redirect).toHaveBeenCalledWith('/error?code=LAU02');
        nock.cleanAll();
      });
    });
  });
});
