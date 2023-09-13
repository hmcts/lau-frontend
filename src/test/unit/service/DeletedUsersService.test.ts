import nock from 'nock';
import config from 'config';
import {AppRequest} from '../../../main/models/appRequest';
import {DeletedUsersAudit} from '../../../main/models/user-deletions/DeletedUsersAudit';
import {DeletedUsersSearchRequest} from '../../../main/models/user-deletions/DeletedUsersSearchRequest';
import {DeletedUsersService} from '../../../main/service/DeletedUsersService';

describe('Deleted Users Service', () => {
  const deletedUsersService = new DeletedUsersService();
  const baseApiUrl = config.get('services.lau-idam-backend.url') as string;

  describe('getDeletedUsers', () => {
    const deletedUsersEndpoint = config.get('services.lau-idam-backend.endpoints.deletedUsers') as string;

    it('return deleted users audit data', async () => {
      const deletedUsersAudit: DeletedUsersAudit = {
        deletionLogs: [],
        totalNumberOfRecords: 0,
        startRecordNumber: 1,
        moreRecords: false,
      };

      nock(baseApiUrl)
        .get(`${deletedUsersEndpoint}?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01`)
        .reply(
          200,
          deletedUsersAudit,
        );

      const searchParameters: Partial<DeletedUsersSearchRequest> = {
        userId: '123',
        startTimestamp: '2021-12-12T12:00:00',
        endTimestamp: '2021-12-12T12:00:01',
      };

      const req = {
        session: {
          deletedUsersFormState: searchParameters,
        },
      };

      const auditData: DeletedUsersAudit = await deletedUsersService.getDeletedUsers(req as AppRequest);

      expect(auditData).toStrictEqual(deletedUsersAudit);
    });
  });
});
