import { Application } from 'express';

jest.mock('config', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('@hmcts/nodejs-healthcheck', () => ({
  addTo: jest.fn(),
  web: jest.fn(() => 'web-check'),
  raw: jest.fn(() => 'raw-check'),
  up: jest.fn(() => ({ status: 'UP' })),
  down: jest.fn(() => ({ status: 'DOWN' })),
}));

import config from 'config';
import * as healthcheck from '@hmcts/nodejs-healthcheck';
import { HealthCheck } from '../../../main/modules/health';

describe('HealthCheck', () => {
  const mockedGet = config.get as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockedGet.mockImplementation((key: string) => {
      const values: Record<string, unknown> = {
        'service.name': 'lau-frontend',
        'redis.enabled': false,
        'services.lau-case-backend.enabled': false,
        'services.lau-idam-backend.enabled': false,
        'services.idam-api.enabled': false,
        'services.s2s.enabled': false,
        'services.hmcts-access.enabled': true,
        'services.hmcts-access.url': 'https://hmcts-access.test',
      };

      return values[key];
    });
  });

  it('adds hmcts-access health check when enabled', () => {
    const app = { locals: {} } as Application;

    new HealthCheck().enableFor(app);

    expect(healthcheck.web).toHaveBeenCalledWith(
      new URL('/health', 'https://hmcts-access.test'),
      expect.any(Object),
    );

    expect(healthcheck.addTo).toHaveBeenCalledWith(
      app,
      expect.objectContaining({
        checks: expect.objectContaining({
          'hmcts-access': 'web-check',
        }),
      }),
    );
  });
});
