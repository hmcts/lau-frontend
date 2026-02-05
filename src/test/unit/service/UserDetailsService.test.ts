import nock from 'nock';
import config from 'config';
import {UserDetailsService} from '../../../main/service/UserDetailsService';
import {
  AccountRecordType,
  AccountStatus,
  NOT_AVAILABLE_MSG,
  ServiceStatus,
  UpdatesStatus,
  UserDetailsAuditData,
  UserDetailsSearchRequest,
} from '../../../main/models/user-details';
import {AppRequest} from '../../../main/models/appRequest';
import {UserUpdatesService} from '../../../main/service/UserUpdatesService';

describe('UserDetailsService', () => {
  const baseApiUrl = config.get('services.lau-eud-backend.url') as string;
  const userDetailsEndpoint = config.get('services.lau-eud-backend.endpoints.userDetails');
  let service: UserDetailsService;
  let userUpdatesService: Pick<UserUpdatesService, 'getUserUpdates'>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Default behaviour: updates are unavailable unless a test overrides.
    userUpdatesService = {
      getUserUpdates: jest.fn().mockRejectedValue(new Error('updates unavailable')),
    };

    service = new UserDetailsService(userUpdatesService as unknown as UserUpdatesService);
  });

  describe('Upstream services work', () => {
    const data: UserDetailsAuditData = {
      userId: '7246bbec-29ed-4029-b8a2-ff76c74c1b10',
      email: 'email@example.net',
      accountStatus: AccountStatus.ACTIVE,
      recordType: AccountRecordType.LIVE,
      accountCreationDate: '2025-10-01T13:14:15Z',
      roles: [],
      organisationalAddress: [{
        addressLine1: '1',
        addressLine2: 'High street',
        townCity: 'Newtown',
        country: 'England',
        postCode: 'AA1 0AA',
      }],
      hasData: true,
      meta: {
        idam: {
          responseCode: 200,
        },
        refdata: {
          responseCode: 200,
        },
      },
      sourceStatus: ServiceStatus.ALL_OK,
    };

    it('returns userDetails for user by userId', async () => {
      nock(baseApiUrl)
        .get(`${userDetailsEndpoint}?userId=${data.userId}`)
        .reply(200, data);
      const req = {
        session: {
          userDetailsFormState: {userIdOrEmail: data.userId},
        },
      };
      (userUpdatesService.getUserUpdates as jest.Mock).mockResolvedValue([]);
      const {details, updates, updatesStatus} = await service.getUserDetails(req as AppRequest<UserDetailsSearchRequest>, false);

      expect(details).toStrictEqual(data);
      expect(updates.length).toBe(0);
      expect(updatesStatus).toBe(UpdatesStatus.EMPTY);
      expect(userUpdatesService.getUserUpdates).toHaveBeenCalledWith(req.session, data.userId);
    });

    it('returns userDetails for user by email', async () => {
      nock(baseApiUrl)
        .get(`${userDetailsEndpoint}?email=${data.email}`)
        .reply(200, data);
      const req = {
        session: {
          userDetailsFormState: {userIdOrEmail: data.email},
        },
      };
      const { details, updatesStatus } = await service.getUserDetails(req as AppRequest<UserDetailsSearchRequest>, true);
      expect(details).toStrictEqual(data);
      expect(updatesStatus).toBe(UpdatesStatus.UNAVAILABLE);
      expect(userUpdatesService.getUserUpdates).toHaveBeenCalledWith(req.session, data.userId);
    });
  });

  describe('Only idam upstream works', () => {
    const data: UserDetailsAuditData = {
      userId: '7246bbec-29ed-4029-b8a2-ff76c74c1b10',
      email: 'email@example.net',
      accountStatus: AccountStatus.ACTIVE,
      recordType: AccountRecordType.LIVE,
      accountCreationDate: '2025-10-01T13:14:15Z',
      roles: [],
      organisationalAddress: [],
      hasData: true,
      meta: {
        idam: {
          responseCode: 200,
        },
        refdata: {
          responseCode: 500,
        },
      },
      sourceStatus: ServiceStatus.IDAM_ONLY,
    };

    it('returns hasData false if none of upstream services work', async () => {
      nock(baseApiUrl)
        .get(`${userDetailsEndpoint}?email=${data.email}`)
        .reply(200, data);
      const req = {
        session: {
          userDetailsFormState: {userIdOrEmail: data.email},
        },
      };
      const { details, updatesStatus } = await service.getUserDetails(req as AppRequest<UserDetailsSearchRequest>, true);
      expect(details).toStrictEqual(data);
      expect(updatesStatus).toBe(UpdatesStatus.UNAVAILABLE);
    });
  });

  describe('Only refdata upstream works', () => {
    const data: UserDetailsAuditData = {
      userId: null,
      email: null,
      accountStatus: null,
      recordType: null,
      accountCreationDate: null,
      roles: [],
      organisationalAddress: [{
        addressLine1: '1',
        addressLine2: 'High street',
        townCity: 'Newtown',
        country: 'England',
        postCode: 'AA1 0AA',
      }],
      hasData: true,
      meta: {
        idam: {
          responseCode: 404,
        },
        refdata: {
          responseCode: 200,
        },
      },
      sourceStatus: ServiceStatus.REFDATA_ONLY,
    };

    it('returns only address if refdata ok', async () => {
      nock(baseApiUrl)
        .get(`${userDetailsEndpoint}?userId=1234-5678`)
        .reply(200, data);
      const req = {
        session: {
          userDetailsFormState: {userIdOrEmail: '1234-5678'},
        },
      };
      const { details, updatesStatus } = await service.getUserDetails(req as AppRequest<UserDetailsSearchRequest>, false);
      expect(updatesStatus).toBe(UpdatesStatus.UNAVAILABLE);

      expect(details).toStrictEqual({
        ...data,
        userId: '1234-5678',
        email: NOT_AVAILABLE_MSG,
        roles: [NOT_AVAILABLE_MSG],
      });
    });
  });

  describe('None of upstream works', () => {
    const data: UserDetailsAuditData = {
      userId: null,
      email: null,
      accountStatus: null,
      recordType: null,
      accountCreationDate: null,
      roles: [],
      organisationalAddress: [],
      meta: {
        idam: {
          responseCode: 404,
        },
        refdata: {
          responseCode: 404,
        },
      },
      sourceStatus: ServiceStatus.REFDATA_ONLY,
    };

    it('it sets hasData to false if none of upstream works', async () => {
      nock(baseApiUrl)
        .get(`${userDetailsEndpoint}?userId=1234-5678`)
        .reply(200, data);
      const req = {
        session: {
          userDetailsFormState: {userIdOrEmail: '1234-5678'},
        },
      };
      const response = await service.getUserDetails(req as AppRequest<UserDetailsSearchRequest>, false);
      expect(response.details).toHaveProperty('hasData', false);
    });

  });
});
