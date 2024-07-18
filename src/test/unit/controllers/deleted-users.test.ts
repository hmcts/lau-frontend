import config from 'config';
import nock from 'nock';
import sinon from 'sinon';
import {DeletedUsersController} from '../../../main/controllers/DeletedUsers.controller';
import {DeletedUsersSearchRequest} from '../../../main/models/user-deletions/DeletedUsersSearchRequest';
import {AppRequest, LogData} from '../../../main/models/appRequest';
import {DeletedUsersLog} from '../../../main/models/user-deletions/DeletedUsersLog';
import {DeletedUsersAudit} from '../../../main/models/user-deletions/DeletedUsersAudit';
import deletedUsersLogs from '../../data/deletedUsersLogs.json';
import {Response} from 'express';
import {AppError, ErrorCode} from '../../../main/models/AppError';

describe('Deleted Users Controller', () => {
  const deletedUsersController = new DeletedUsersController();
  const basePath: string = config.get('services.lau-idam-backend.url');
  const uri = '/audit/deletedAccounts';
  const params = 'userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01';

  describe('getDeletedUsersData', () => {
    const pathQuery = `${uri}?${params}&page=1`;

    const searchRequest: Partial<DeletedUsersSearchRequest> = {
      userId: '123',
      startTimestamp: '2021-12-12T12:00:00',
      endTimestamp: '2021-12-12T12:00:01',
      page: 1,
    };

    const req = {
      session: {
        deletedUsersFormState: searchRequest,
      },
    };


    it('returns valid deleted users data - no entries', async() => {
      nock(basePath)
        .get(pathQuery)
        .reply(
          200,
          {deletionLogs: [], totalNumberOfRecords: 0, startRecordNumber: 1, moreRecords: false },
        );

      return deletedUsersController.getDeletedUsersData(req as AppRequest).then((deletedUsers: LogData) => {
        const expectDeletedUsers: LogData = {
          hasData: false,
          moreRecords: false,
          rows: [],
          startRecordNumber: 1,
          noOfRows: 0,
          totalNumberOfRecords: 0,
          currentPage: 1,
          lastPage: 1,
        };
        expect(deletedUsers).toStrictEqual(expectDeletedUsers);
        nock.cleanAll();
      });
    });

    it('returns valid deleted users data - with <= 12 entries', () => {
      const deletedUsersLogs: DeletedUsersLog[] =[
        {
          'userId': 'U0001',
          'firstName': 'John1',
          'lastName': 'Smith1',
          'emailAddress': 'john1.smith1@example.org',
          'deletionTimestamp': '2023-08-20T14:15:30',
        },
        {
          'userId': 'U0002',
          'firstName': 'John2',
          'lastName': 'Smith2',
          'emailAddress': 'john2.smith2@example.org',
          'deletionTimestamp': '2023-08-20T17:30:45',
        },
      ];

      const deletedUsersAudit: DeletedUsersAudit = {
        deletionLogs: deletedUsersLogs,
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 2,
      };

      nock(basePath)
        .get(pathQuery)
        .reply(200, deletedUsersAudit);

      return deletedUsersController.getDeletedUsersData(req as AppRequest).then((deletedUsers: LogData) => {
        const expectDeletedUsers: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{text: 'U0001'}, {text: 'john1.smith1@example.org'}, {text: 'John1'}, {text:'Smith1'}, {text: '2023-08-20 14:15:30'}],
            [{text: 'U0002'}, {text: 'john2.smith2@example.org'}, {text: 'John2'}, {text:'Smith2'}, {text: '2023-08-20 17:30:45'}],
          ],
          startRecordNumber: 1,
          noOfRows: 2,
          totalNumberOfRecords: 2,
          currentPage: 1,
          lastPage: 1,
        };

        // Add `classes: 'overflow-wrap'` to all cells in rows
        expectDeletedUsers.rows.forEach(row => row.forEach(cell => cell.classes = 'overflow-wrap'));

        expect(deletedUsers).toStrictEqual(expectDeletedUsers);
        nock.cleanAll();
      });
    });

    it('returns valid deleted users data - with > 12 entries', () => {
      const deletedUsersAudit: DeletedUsersAudit = {
        deletionLogs: deletedUsersLogs.deletedUsersLog as DeletedUsersLog[],
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 14,
      };

      nock(basePath)
        .get(pathQuery)
        .reply(200, deletedUsersAudit);

      return deletedUsersController.getDeletedUsersData(req as AppRequest).then((deletedUsers: LogData) => {
        const expectDeletedUsers: LogData = {
          hasData: true,
          moreRecords: false,
          rows: [
            [{text: 'U0001'}, {text: 'john01.smith01@example.org'}, {text: 'John01'}, {text:'Smith01'}, {text: '2023-08-20 14:15:30'}],
            [{text: 'U0002'}, {text: 'john02.smith02@example.org'}, {text: 'John02'}, {text:'Smith02'}, {text: '2023-08-21 17:30:45'}],
            [{text: 'U0003'}, {text: 'john03.smith03@example.org'}, {text: 'John03'}, {text:'Smith03'}, {text: '2023-08-22 14:15:30'}],
            [{text: 'U0004'}, {text: 'john04.smith04@example.org'}, {text: 'John04'}, {text:'Smith04'}, {text: '2023-08-23 17:30:45'}],
            [{text: 'U0005'}, {text: 'john05.smith05@example.org'}, {text: 'John05'}, {text:'Smith05'}, {text: '2023-08-24 14:15:30'}],
            [{text: 'U0006'}, {text: 'john06.smith06@example.org'}, {text: 'John06'}, {text:'Smith06'}, {text: '2023-08-25 17:30:45'}],
            [{text: 'U0007'}, {text: 'john07.smith07@example.org'}, {text: 'John07'}, {text:'Smith07'}, {text: '2023-08-26 14:15:30'}],
            [{text: 'U0008'}, {text: 'john08.smith08@example.org'}, {text: 'John08'}, {text:'Smith08'}, {text: '2023-08-27 17:30:45'}],
            [{text: 'U0009'}, {text: 'john09.smith09@example.org'}, {text: 'John09'}, {text:'Smith09'}, {text: '2023-08-28 14:15:30'}],
            [{text: 'U0010'}, {text: 'john10.smith10@example.org'}, {text: 'John10'}, {text:'Smith10'}, {text: '2023-08-29 17:30:45'}],
            [{text: 'U0011'}, {text: 'john11.smith11@example.org'}, {text: 'John11'}, {text:'Smith11'}, {text: '2023-08-30 14:15:30'}],
            [{text: 'U0012'}, {text: 'john12.smith12@example.org'}, {text: 'John12'}, {text:'Smith12'}, {text: '2023-08-31 17:30:45'}],
            [{text: 'U0013'}, {text: 'john13.smith13@example.org'}, {text: 'John13'}, {text:'Smith13'}, {text: '2023-09-01 14:15:30'}],
            [{text: 'U0014'}, {text: 'john14.smith14@example.org'}, {text: 'John14'}, {text:'Smith14'}, {text: '2023-08-02 17:30:45'}],
          ],
          startRecordNumber: 1,
          noOfRows: 14,
          totalNumberOfRecords: 14,
          currentPage: 1,
          lastPage: 3,
        };

        // Add `classes: 'overflow-wrap'` to all cells in rows
        expectDeletedUsers.rows.forEach(row => row.forEach(cell => cell.classes = 'overflow-wrap'));

        expect(deletedUsers).toStrictEqual(expectDeletedUsers);
        nock.cleanAll();
      });
    });

    it('returns app error if no log data is returned', async() => {
      nock(basePath)
        .get(pathQuery)
        .reply(200, {});

      return deletedUsersController.getDeletedUsersData(req as AppRequest).catch((error: AppError) => {
        expect(error.message).toBe('Deleted users data malformed');
        expect(error.code).toBe(ErrorCode.IDAM_BACKEND);
        nock.cleanAll();
      });
    });
  });

  describe('getPage', () => {
    const pathQuery = `${uri}?${params}&page=2`;
    const appRequest = {
      session: {
        deletedUsersFormState: {
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

    it('repeats the search using same criteria with new page number', async () => {
      const deletedUsersAudit: DeletedUsersAudit = {
        deletionLogs: deletedUsersLogs.deletedUsersLog as DeletedUsersLog[],
        moreRecords: false,
        startRecordNumber: 1,
        totalNumberOfRecords: 0,
      };

      nock(basePath)
        .get(pathQuery)
        .reply(200, deletedUsersAudit);

      const res = { redirect: sinon.spy() };

      // @ts-ignore Conversion of res with spy
      return deletedUsersController.getPage(appRequest as AppRequest, res as Response).then(() => {
        expect(appRequest.session.deletedUsersFormState.page).toBe(2);
        expect(res.redirect.calledOnce).toBeTruthy();
        nock.cleanAll();
      });
    });

    it('redirects to error page with code on fetch failure', async () => {
      nock(basePath)
        .get(pathQuery)
        .reply(200, {});

      const res = { redirect: sinon.spy() };

      // @ts-ignore Conversion of res with spy
      return deletedUsersController.getPage(appRequest as AppRequest, res as Response).then(() => {
        expect(res.redirect.calledOnce).toBeTruthy();
        expect(res.redirect.calledWith(`/error?code=${ErrorCode.IDAM_BACKEND}`));
        nock.cleanAll();
      });
    });

  });
});
