import sinon from 'sinon';
import {Response} from 'express';
import {AppRequest, AppSession} from '../../../main/models/appRequest';
import {UserDetailsService} from '../../../main/service/UserDetailsService';
import {UserDetailsController} from '../../../main/controllers/UserDetails.controller';
import {
  AccountRecordType,
  AccountStatus,
  Address,
  NOT_AVAILABLE_MSG, UpdatesStatus,
  UserDetailsSearchRequest,
} from '../../../main/models/user-details';
import {AppError, ErrorCode} from '../../../main/models/AppError';
import {UserDetailsViewModel} from '../../../main/models/user-details/UserDetailsAuditData';


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

  it('returns validation error when userIdOrEmail is tooLong', async () => {
    const longValue = '1234abcd-5678-efab-1234-abcd5678efab-1234abcd-5678-efab-1234-abcd5678efab';
    const service = { getUserDetails: jest.fn() } as unknown as UserDetailsService;
    const controller = new UserDetailsController(service);
    const req = makeReq({ userIdOrEmail: longValue });
    const res = makeRes() as unknown as Response;

    await controller.post(req as AppRequest<UserDetailsSearchRequest>, res);

    expect(req.session.userDetailsFormState.userIdOrEmail).toBe(longValue);
    expect(req.session.fromPost).toBe(true);
    expect(req.session.errors).toEqual([{ propertyName: 'userIdOrEmail', errorType: 'valueTooLong' }]);
    expect(res.redirect).toHaveBeenCalledWith('/user-details-audit');
    expect(service.getUserDetails).not.toHaveBeenCalled();
  });

  it('returns results when input is valid email longer than 64 characters', async () => {
    const longEmail = '1234abcd-5678-efab-1234-abcd5678efab-1234abcd-5678-efab-1234@example.org';
    const userDetailsMock = {
      organisationalAddress: [
        { addressLine1: '10 Downing St',  country: 'England', postCode: 'AA00 1AA'},
        { addressLine1: '<script>alert("1")</script>1', addressLine2: 'Victoria str.', townCity: 'London'},
      ],
      userId: 'userId',
      email: longEmail,
      roles: ['ROLE'],
    };
    const service = {
      getUserDetails: jest.fn().mockResolvedValue({
        details: userDetailsMock,
        updates: [],
        updatesStatus: UpdatesStatus.EMPTY,
      }),
    } as unknown as UserDetailsService;
    const controller = new UserDetailsController(service);
    const req = makeReq({userIdOrEmail: longEmail });
    const res = makeRes() as unknown as Response;

    await controller.post(req as AppRequest<UserDetailsSearchRequest>, res);

    expect(service.getUserDetails).toHaveBeenCalledTimes(1);
    expect(req.session.userDetailsFormState.userIdOrEmail)
      .toBe('1234abcd-5678-efab-1234-abcd5678efab-1234abcd-5678-efab-1234@example.org');
    expect(req.session.userDetailsData).toEqual({
      ...userDetailsMock,
      formattedAddresses: [
        '10 Downing St, England, AA00 1AA',
        '&lt;script&gt;alert(&quot;1&quot;)&lt;/script&gt;1, Victoria str., London',
      ],
      formattedAccCreationDate: NOT_AVAILABLE_MSG,
      displayedStatus: NOT_AVAILABLE_MSG,
      userUpdateRows: [],
      updatesStatus: UpdatesStatus.EMPTY,
    });
    expect(res.redirect).toHaveBeenCalledWith('/user-details-audit#results-section');
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
    const service = {
      getUserDetails: jest.fn().mockResolvedValue({
        details: userDetailsMock,
        updates: [],
        updatesStatus: UpdatesStatus.EMPTY,
      }),
    } as unknown as UserDetailsService;
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
      userUpdateRows: [],
      updatesStatus: UpdatesStatus.EMPTY,
    });
    expect(res.redirect).toHaveBeenCalledWith('/user-details-audit#results-section');
  });

  it('returns results when input looks like UUID', async () => {
    const userDetailsMock = { organisationalAddress: [] as Address[], name: 'John Smith', roles: ['ROLE'] };
    const service = {
      getUserDetails: jest.fn().mockResolvedValue({
        details: userDetailsMock,
        updates: [],
        updatesStatus: UpdatesStatus.EMPTY,
      }),
    } as unknown as UserDetailsService;
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
      userUpdateRows: [],
      updatesStatus: UpdatesStatus.EMPTY,
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

    const service = {
      getUserDetails: jest.fn().mockResolvedValue({
        details: rawUserDetails,
        updates: [],
        updatesStatus: UpdatesStatus.EMPTY,
      }),
    } as unknown as UserDetailsService;
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
      userUpdateRows: [],
      updatesStatus: UpdatesStatus.EMPTY,
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

describe('UserDetailsController.postPdf', () => {
  const mockPdfBuffer = Buffer.from('mock-user-details-content');

  const makeReq = (sessionData?: Partial<UserDetailsViewModel> | null): AppRequest<UserDetailsSearchRequest> => ({
    body: {} as UserDetailsSearchRequest,
    session: {
      userDetailsData: sessionData as UserDetailsViewModel,
    } as AppSession,
    app: {
      render: jest.fn((template, data, callback) => {
        callback(null, '<html>mock rendered html</html>');
      }),
    },
  }) as unknown as AppRequest<UserDetailsSearchRequest>;

  const makeRes = () => ({
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
    set: jest.fn(),
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should return 400 when no session data exists', async () => {
    const controller = new UserDetailsController();
    const req = makeReq(null);
    const res = makeRes() as unknown as Response;

    await controller.postPdf(req as AppRequest<UserDetailsSearchRequest>, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('No search results available to generate PDF');
  });

  it('should generate PDF successfully with session data', async () => {
    const mockSessionData = {
      userId: 'test-user-id',
      email: 'test@example.com',
      formattedAddresses: ['123 Main St, London, SW1A 1AA'],
      displayedStatus: 'Active',
      formattedAccCreationDate: '2025-11-01 10:00:00',
      roles: ['admin', 'user'],
    };

    jest.doMock('../../../main/service/pdf-service', () => ({
      renderHtmlToPdfBuffer: jest.fn().mockResolvedValue(mockPdfBuffer),
    }));

    const controller = new UserDetailsController();
    const req = makeReq(mockSessionData);
    const res = makeRes() as unknown as Response;

    await controller.postPdf(req as AppRequest<UserDetailsSearchRequest>, res);

    expect(req.app.render).toHaveBeenCalledWith(
      'user-details/pdf-template.njk',
      { userDetailsAuditData: mockSessionData },
      expect.any(Function),
    );
    expect(res.set).toHaveBeenCalledWith({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="test-user-id.pdf"',
      'Content-Length': mockPdfBuffer.length,
    });
    expect(res.send).toHaveBeenCalledWith(mockPdfBuffer);
  });

  it('should handle template rendering errors', async () => {
    const mockSessionData = {
      userId: 'test-user-id',
      email: 'test@example.com',
    };

    const controller = new UserDetailsController();
    const req = {
      ...makeReq(mockSessionData),
      app: {
        render: jest.fn((template, data, callback) => {
          callback(new Error('Template rendering failed'), null);
        }),
      },
    } as unknown as AppRequest<UserDetailsSearchRequest>;
    const res = makeRes() as unknown as Response;

    await controller.postPdf(req as AppRequest<UserDetailsSearchRequest>, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Failed to generate PDF');
  });

  it('should handle PDF generation errors', async () => {
    const mockSessionData = {
      userId: 'test-user-id',
      email: 'test@example.com',
    };

    jest.doMock('../../../main/service/pdf-service', () => ({
      renderHtmlToPdfBuffer: jest.fn().mockRejectedValue(new Error('PDF generation failed')),
    }));

    const controller = new UserDetailsController();
    const req = makeReq(mockSessionData);
    const res = makeRes() as unknown as Response;

    await controller.postPdf(req as AppRequest<UserDetailsSearchRequest>, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Failed to generate PDF');
  });
});

