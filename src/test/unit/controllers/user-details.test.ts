import sinon from 'sinon';
import {Response} from 'express';
import {AppRequest, AppSession} from '../../../main/models/appRequest';
import {UserDetailsService} from '../../../main/service/UserDetailsService';
import {UserDetailsController} from '../../../main/controllers/UserDetails.controller';
import {
  AccountRecordType,
  AccountStatus,
  Address,
  NOT_AVAILABLE_MSG,
  UserDetailsSearchRequest,
} from '../../../main/models/user-details';
import {AppError, ErrorCode} from '../../../main/models/AppError';


describe('UserDetailsController.post', () => {
  const makeRes = () => ({ redirect: jest.fn() });

  const makeReq = (body: Partial<UserDetailsSearchRequest>): AppRequest<UserDetailsSearchRequest> =>
    ({
      body : {userIdOrEmail: '', ...body} as UserDetailsSearchRequest,
      session: {} as AppSession,
    }) as AppRequest<UserDetailsSearchRequest>;

  afterEach(() => {
    jest.clearAllMocks();
    sinon.restore();
  });

  it('returns validation error when userIdOrEmail is missing', async () => {
    const service = { getUserDetails: jest.fn() } as unknown as UserDetailsService;
    const controller = new UserDetailsController(service);
    const req = makeReq({ userIdOrEmail: '   ' });
    const res = makeRes() as unknown as Response;

    await controller.post(req as AppRequest<UserDetailsSearchRequest>, res);

    expect(req.session.userDetailsFormState.userIdOrEmail).toBe('');
    expect(req.session.fromPost).toBe(true);
    expect(req.session.errors).toEqual([{ propertyName: 'userIdOrEmail', errorType: 'required' }]);
    expect(res.redirect).toHaveBeenCalledWith('/user-details-audit');
    expect(service.getUserDetails).not.toHaveBeenCalled();
  });

  it('returns results when input is valid email', async () => {
    const userDetailsMock = {
      organisationalAddress: [
        { addressLine1: '10 Downing St',  country: 'England', postCode: 'AA00 1AA'},
        { addressLine1: '<script>alert("1")</script>1', addressLine2: 'Victoria str.', townCity: 'London'},
      ],
      userId: 'userId',
      email: 'user@example.com',
      roles: ['ROLE'],
    };
    const service = { getUserDetails: jest.fn().mockResolvedValue(userDetailsMock) } as unknown as UserDetailsService;
    const controller = new UserDetailsController(service);
    const req = makeReq({ userIdOrEmail: 'user@example.com' });
    const res = makeRes() as unknown as Response;

    await controller.post(req as AppRequest<UserDetailsSearchRequest>, res);

    expect(service.getUserDetails).toHaveBeenCalledTimes(1);
    expect(req.session.userDetailsFormState.userIdOrEmail).toBe('user@example.com');
    expect(req.session.userDetailsData).toEqual({
      ...userDetailsMock,
      formattedAddresses: [
        '10 Downing St, England, AA00 1AA',
        '&lt;script&gt;alert(&quot;1&quot;)&lt;/script&gt;1, Victoria str., London',
      ],
      formattedAccCreationDate: NOT_AVAILABLE_MSG,
      displayedStatus: NOT_AVAILABLE_MSG,
    });
    expect(res.redirect).toHaveBeenCalledWith('/user-details-audit#results-section');
  });

  it('returns results when input looks like UUID', async () => {
    const userDetailsMock = { organisationalAddress: [] as Address[], name: 'John Smith', roles: ['ROLE'] };
    const service = { getUserDetails: jest.fn().mockResolvedValue(userDetailsMock) } as unknown as UserDetailsService;
    const controller = new UserDetailsController(service);
    const req = makeReq({ userIdOrEmail: '4f18b03b-7d20-4220-9344-1234567890ab' });
    const res = makeRes() as unknown as Response;

    // Act
    await controller.post(req as AppRequest<UserDetailsSearchRequest>, res);

    // Assert
    expect(service.getUserDetails).toHaveBeenCalledTimes(1);
    expect(req.session.userDetailsData).toEqual({
      ...userDetailsMock,
      formattedAddresses: [NOT_AVAILABLE_MSG],
      formattedAccCreationDate: NOT_AVAILABLE_MSG,
      displayedStatus: NOT_AVAILABLE_MSG,
    });
    expect(res.redirect).toHaveBeenCalledWith('/user-details-audit#results-section');
  });

  it('returns formatted data', async () => {
    const rawUserDetails = {
      userId: 'some-id',
      email: 'test@example.com',
      accountStatus: AccountStatus.SUSPENDED,
      recordType: AccountRecordType.LIVE,
      accountCreationDate: '2025-10-15T10:00:00.000Z',
      roles: ['test-role'],
      organisationalAddress: [{
        addressLine1: '123 Main St',
        townCity: 'Townsville',
        postCode: 'TS1 1AA',
      }],
      meta: {
        idam: {responseCode: 200},
        refdata: {responseCode: 200},
      },
      sourceStatus: 'ALL_OK',
    };

    const service = { getUserDetails: jest.fn().mockResolvedValue(rawUserDetails) } as unknown as UserDetailsService;
    const controller = new UserDetailsController(service);
    const req = {
      ...makeReq({ userIdOrEmail: 'email@example.com' }),
      session: {} as AppSession,
    };
    const res = makeRes() as unknown as Response;

    await controller.post(req as AppRequest<UserDetailsSearchRequest>, res);

    expect(req.session.userDetailsFormState.userIdOrEmail).toBe('email@example.com');
    expect(req.session.fromPost).toBe(true);
    expect(res.redirect).toHaveBeenCalledWith('/user-details-audit#results-section');
    expect(req.session.userDetailsData).toEqual({
      ...rawUserDetails,
      formattedAddresses: ['123 Main St, Townsville, TS1 1AA'],
      formattedAccCreationDate: '2025-10-15 10:00:00',
      displayedStatus: 'Live but suspended',
    });
  });

  it('throws an error when service throws an AppError', async () => {
    const appErr = new AppError('Boom', ErrorCode.EUD_BACKEND);
    const service = { getUserDetails: jest.fn().mockRejectedValue(appErr) } as unknown as UserDetailsService;
    const controller = new UserDetailsController(service);
    const req = makeReq({ userIdOrEmail: 'user@example.com' });
    const res = makeRes() as unknown as Response;

    await controller.post(req as AppRequest<UserDetailsSearchRequest>, res);

    expect(res.redirect).toHaveBeenCalledWith(`/error?code=${ErrorCode.EUD_BACKEND}`);
  });
});
