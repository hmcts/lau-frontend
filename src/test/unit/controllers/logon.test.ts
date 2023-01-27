import nock from 'nock';
import sinon from 'sinon';
import {LogonSearchRequest} from '../../../main/models/idam/LogonSearchRequest';
import {LogonController} from '../../../main/controllers/Logon.controller';
import {AppRequest, LogData} from '../../../main/models/appRequest';
import {LogonLog} from '../../../main/models/idam/LogonLogs';
import {LogonAudit} from '../../../main/models/idam/LogonAudit';
import logonLogs from '../../data/logonLogs.json';
import {Response} from 'express';
import {AppError, ErrorCode} from '../../../main/models/AppError';

describe('Logon Controller', () => {
  const logonController = new LogonController();

  describe('getLogData', () => {
    it('returns valid log data - no logons', async () => {
      nock('http://localhost:4551')
        .get('/audit/logon?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          {logonLog: [], totalNumberOfRecords: 0, startRecordNumber: 1, moreRecords: false},
        );

      const searchRequest: Partial<LogonSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          logonFormState: searchRequest,
        },
      };

      return logonController.getLogData(req as AppRequest).then((logons: LogData) => {
        const expectLogons: LogData = {
          hasData: false,
          moreRecords: false,
          rows: [],
          startRecordNumber: 1,
          noOfRows: 0,
          totalNumberOfRecords: 0,
          currentPage: 1,
          lastPage: 1,
        };
        expect(logons).toStrictEqual(expectLogons);
        nock.cleanAll();
      });
    });

    it('returns valid log data - with logons <= 12', async () => {
      const logonLogs: LogonLog[] = [
        {
          'userId': 'U0001',
          'emailAddress': 'email@email.com',
          'service': 'Test',
          'loginState' : 'AUTHORIZE',
          'ipAddress': '123.456.7.8',
          'timestamp': '2020-07-20 15:00:00',
        },
        {
          'userId': 'U0002',
          'emailAddress': 'email@email.com',
          'service': 'Test',
          'loginState' : 'AUTHENTICATE',
          'ipAddress': '123.456.7.8',
          'timestamp': '2020-07-20 15:00:00',
        },
      ];

      const logonAudit: LogonAudit = {
        logonLog: logonLogs,
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 2,
      };

      nock('http://localhost:4551')
        .get('/audit/logon?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          logonAudit,
        );

      const searchRequest: Partial<LogonSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          logonFormState: searchRequest,
        },
      };

      return logonController.getLogData(req as AppRequest).then((logons: LogData) => {
        const expectLogons: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{text: 'U0001'}, {text: 'email@email.com'}, {'text':'AUTHORIZE'}, {text: 'Test'}, {text: '123.456.7.8'}, {text: '2020-07-20 15:00:00'}],
            [{text: 'U0002'}, {text: 'email@email.com'}, {'text':'AUTHENTICATE'}, {text: 'Test'}, {text: '123.456.7.8'}, {text: '2020-07-20 15:00:00'}],
          ],
          startRecordNumber: 1,
          noOfRows: 2,
          totalNumberOfRecords: 2,
          currentPage: 1,
          lastPage: 1,
        };
        // Add `classes: 'overflow-wrap'` to all cells in rows
        expectLogons.rows.forEach(row => row.forEach(cell => cell.classes = 'overflow-wrap'));

        expect(logons).toStrictEqual(expectLogons);
        nock.cleanAll();
      });
    });

    it('returns valid log data - with logons > 12', async () => {
      const logonAudit: LogonAudit = {
        logonLog: logonLogs.logonLog as LogonLog[],
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 14,
      };

      nock('http://localhost:4551')
        .get('/audit/logon?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(
          200,
          logonAudit,
        );

      const searchRequest: Partial<LogonSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          logonFormState: searchRequest,
        },
      };

      return logonController.getLogData(req as AppRequest).then((logons: LogData) => {
        const expectLogons: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{'text':'3748201'},{'text':'Mark.Taylor@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.158.1.38'},{'text':'2021-06-23 22:20:05'}],
            [{'text':'3748202'},{'text':'Dan.Morgan@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.151.1.28'},{'text':'2020-02-02 08:16:27'}],
            [{'text':'3748203'},{'text':'Mark.Taylor@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.158.1.38'},{'text':'2021-06-23 22:20:05'}],
            [{'text':'3748204'},{'text':'Dan.Morgan@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.151.1.28'},{'text':'2020-02-02 08:16:27'}],
            [{'text':'3748205'},{'text':'Mark.Taylor@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.158.1.38'},{'text':'2021-06-23 22:20:05'}],
            [{'text':'3748206'},{'text':'Dan.Morgan@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.151.1.28'},{'text':'2020-02-02 08:16:27'}],
            [{'text':'3748207'},{'text':'Mark.Taylor@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.158.1.38'},{'text':'2021-06-23 22:20:05'}],
            [{'text':'3748208'},{'text':'Dan.Morgan@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.151.1.28'},{'text':'2020-02-02 08:16:27'}],
            [{'text':'3748209'},{'text':'Mark.Taylor@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.158.1.38'},{'text':'2021-06-23 22:20:05'}],
            [{'text':'3748210'},{'text':'Dan.Morgan@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.151.1.28'},{'text':'2020-02-02 08:16:27'}],
            [{'text':'3748211'},{'text':'Mark.Taylor@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.158.1.38'},{'text':'2021-06-23 22:20:05'}],
            [{'text':'3748212'},{'text':'Dan.Morgan@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.151.1.28'},{'text':'2020-02-02 08:16:27'}],
            [{'text':'3748213'},{'text':'Mark.Taylor@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.158.1.38'},{'text':'2021-06-23 22:20:05'}],
            [{'text':'3748214'},{'text':'Dan.Morgan@company.com'},{'text':'AUTHORIZE'},{'text':'idam-web-admin'},{'text':'192.151.1.28'},{'text':'2020-02-02 08:16:27'}],
          ],
          startRecordNumber: 1,
          noOfRows: 14,
          totalNumberOfRecords: 14,
          currentPage: 1,
          lastPage: 3,
        };
        // Add `classes: 'overflow-wrap'` to all cells in rows
        expectLogons.rows.forEach(row => row.forEach(cell => cell.classes = 'overflow-wrap'));

        expect(logons).toStrictEqual(expectLogons);
        nock.cleanAll();
      });
    });

    it('returns app error if no log data is returned', async () => {
      nock('http://localhost:4551')
        .get('/audit/logon?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1')
        .reply(200, {});

      const searchRequest: Partial<LogonSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
        page: 1,
      };

      const req = {
        session: {
          logonFormState: searchRequest,
        },
      };

      return logonController.getLogData(req as AppRequest).catch((error: AppError) => {
        expect(error.message).toBe('Logons data malformed');
        expect(error.code).toBe(ErrorCode.IDAM_BACKEND);
        nock.cleanAll();
      });
    });
  });

  describe('getPage', () => {
    it('repeats the search using same criteria with new page number', async () => {
      const logonAudit: LogonAudit = {
        logonLog: logonLogs.logonLog as LogonLog[],
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 0,
      };

      nock('http://localhost:4551')
        .get('/audit/logon?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=2')
        .reply(
          200,
          logonAudit,
        );

      const appRequest = {
        session: {
          logonFormState: {
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
      return logonController.getPage(appRequest as AppRequest, res as Response).then(() => {
        expect(appRequest.session.logonFormState.page).toBe(2);
        expect(res.redirect.calledOnce).toBeTruthy();
        nock.cleanAll();
      });
    });

    it('redirects to error page with code on fetch failure', async () => {
      nock('http://localhost:4551')
        .get('/audit/logon?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=2')
        .reply(200, {});

      const appRequest = {
        session: {
          logonFormState: {
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
      return logonController.getPage(appRequest as AppRequest, res as Response).then(() => {
        expect(res.redirect.calledOnce).toBeTruthy();
        expect(res.redirect.calledWith('/error?code=LAU03')).toBeTruthy();
        nock.cleanAll();
      });
    });
  });
});
