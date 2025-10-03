import nock from 'nock';
import config from 'config';
import {UserDetailsService} from '../../../main/service/UserDetailsService';
import {UserDetailsAuditData, UserDetailsSearchRequest} from '../../../main/models/user-details';
import {AppRequest} from '../../../main/models/appRequest';

describe('UserDetailsService', () => {
  const baseApiUrl = config.get('services.lau-eud-backend.url') as string;
  const userDetailsEndpoint = config.get('services.lau-eud-backend.endpoints.userDetails');
  let service: UserDetailsService;

  const data: UserDetailsAuditData = {
    userId: '7246bbec-29ed-4029-b8a2-ff76c74c1b10',
    email: 'email@example.net',
    accountStatus: 'ACTIVE',
    accountCreationDate: '2025-10-01T13:14:15Z',
    roles: [],
    organisationalAddress: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserDetailsService();
  });

  it('returns userDetails for user by userId', async () => {
    nock(baseApiUrl)
      .get(`${userDetailsEndpoint}?userId=${data.userId}`)
      .reply(200, data);
    const req = {
      session: {
        userDetailsFormState: {userIdOrEmail: data.userId},
      },
    };
    const auditData = await service.getUserDetails(req as AppRequest<UserDetailsSearchRequest>, false);

    expect(auditData).toStrictEqual(data);
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
    const auditData = await service.getUserDetails(req as AppRequest<UserDetailsSearchRequest>, true);
    expect(auditData).toStrictEqual(data);
  });
});
