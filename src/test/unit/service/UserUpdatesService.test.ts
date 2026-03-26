/* eslint-disable @typescript-eslint/no-explicit-any */

import {UserUpdatesService} from '../../../main/service/UserUpdatesService';
import {AppSession} from '../../../main/models/appRequest';

jest.mock('config', () => {
  const get = jest.fn((key: string) => {
    switch (key) {
      case 'services.lau-eud-backend.url':
        return 'http://mock-backend';
      case 'services.lau-eud-backend.endpoints.userAccountUpdates':
        return '/user-updates';
      case 'pagination.maxPerPage':
        return 100;
      case 'services.s2s.enabled':
        return false;
      default:
        return undefined;
    }
  });

  return { __esModule: true, default: { get }, get };
});

describe('UserUpdatesService', () => {
  let service: UserUpdatesService;
  let session: AppSession;

  beforeEach(() => {
    service = new UserUpdatesService();
    session = { user: { accessToken: 'token', expiresAt: 9999999999 } } as unknown as AppSession;
  });

  test('getUserUpdates returns the content array from the backend response', async () => {
    const mockResponse = { content: [
      { eventName: 'name', value: 'John', timestamp: '2025-10-15T10:00:00Z' },
      { eventName: 'lastname', value: 'Smith', timestamp: '2025-10-15T09:00:00Z' },
    ] };

    const getSpy = jest
      .spyOn(service as any, 'get')
      .mockResolvedValue(mockResponse);

    const result = await service.getUserUpdates(session, 'USER_123');

    expect(result).toEqual(mockResponse.content);
    expect(getSpy).toHaveBeenCalledTimes(1);
  });

  test('getUserUpdates normalizes null/empty timestamps to empty string', async () => {
    const mockResponse = { content: [
      { eventName: 'name', value: 'John', timestamp: null },
      { eventName: 'lastname', value: 'Smith', timestamp: '' },
    ] };

    jest
      .spyOn(service as any, 'get')
      .mockResolvedValue(mockResponse);

    const result = await service.getUserUpdates(session, 'USER_123');

    expect(result).toEqual([
      { eventName: 'name', value: 'John', timestamp: '' },
      { eventName: 'lastname', value: 'Smith', timestamp: '' },
    ]);
  });

  test('getUserUpdates calls BaseService.get with endpoint and query string containing userId and size', async () => {
    const getSpy = jest
      .spyOn(service as any, 'get')
      .mockResolvedValue({ content: [] });

    await service.getUserUpdates(session, 'USER_123');

    expect(getSpy).toHaveBeenCalledTimes(1);

    const [, endpoint, qs] = getSpy.mock.calls[0];
    expect(endpoint).toBe('/user-updates');

    // qs includes leading '?' and both params
    expect(String(qs)).toContain('?');
    expect(String(qs)).toContain('userId=USER_123');
    expect(String(qs)).toContain('size=100');
  });

  test('getUserUpdates URL-encodes userId in the query string', async () => {
    const getSpy = jest
      .spyOn(service as any, 'get')
      .mockResolvedValue({ content: [] });

    await service.getUserUpdates(session, 'A B');

    const [, , qs] = getSpy.mock.calls[0];
    expect(String(qs)).toContain('userId=A%20B');
  });
});
