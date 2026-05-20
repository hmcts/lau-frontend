jest.mock('config', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockEmit = jest.fn();
const mockForceFlush = jest.fn();
const mockGetLogger = jest.fn(() => ({ emit: mockEmit }));

jest.mock('@azure/monitor-opentelemetry-exporter', () => ({
  AzureMonitorLogExporter: jest.fn(),
}));

jest.mock('@opentelemetry/resources', () => ({
  resourceFromAttributes: jest.fn(attributes => ({ attributes })),
}));

jest.mock('@opentelemetry/sdk-logs', () => ({
  BatchLogRecordProcessor: jest.fn(),
  LoggerProvider: jest.fn(() => ({
    forceFlush: mockForceFlush,
    getLogger: mockGetLogger,
  })),
}));

jest.mock('@opentelemetry/semantic-conventions', () => ({
  ATTR_SERVICE_NAME: 'service.name',
}));

jest.unmock('../../../main/modules/appinsights');

import config from 'config';
import { AzureMonitorLogExporter } from '@azure/monitor-opentelemetry-exporter';
import { SeverityNumber } from '@opentelemetry/api-logs';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import {
  ATTR_EXCEPTION_MESSAGE,
  ATTR_EXCEPTION_STACKTRACE,
  ATTR_EXCEPTION_TYPE,
} from '@opentelemetry/semantic-conventions';
import { AppInsights } from '../../../main/modules/appinsights';

describe('AppInsights', () => {
  const mockedConfigGet = config.get as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.OTEL_SERVICE_NAME;
  });

  it('does not initialise the log exporter without a connection string', () => {
    mockedConfigGet.mockReturnValue(false);

    new AppInsights().enable();

    expect(AzureMonitorLogExporter).not.toHaveBeenCalled();
    expect(LoggerProvider).not.toHaveBeenCalled();
  });

  it('configures a log-only Azure Monitor exporter', () => {
    process.env.OTEL_SERVICE_NAME = 'lau-frontend';
    mockedConfigGet.mockImplementation((key: string) => {
      const values: Record<string, unknown> = {
        'appInsights.connectionString': 'InstrumentationKey=test',
        'service.name': 'service-name-from-config',
      };

      return values[key];
    });

    new AppInsights().enable();

    expect(AzureMonitorLogExporter).toHaveBeenCalledWith({ connectionString: 'InstrumentationKey=test' });
    expect(BatchLogRecordProcessor).toHaveBeenCalledWith(expect.any(AzureMonitorLogExporter));
    expect(LoggerProvider).toHaveBeenCalledWith(expect.objectContaining({
      resource: { attributes: { 'service.name': 'lau-frontend' } },
      processors: [expect.any(BatchLogRecordProcessor)],
    }));
    expect(mockGetLogger).toHaveBeenCalledWith('lau-frontend');
    expect(mockEmit).toHaveBeenCalledWith(expect.objectContaining({
      body: 'App insights activated',
      severityNumber: SeverityNumber.INFO,
    }));
  });

  it('emits Winston traces as Azure Monitor log records', () => {
    mockedConfigGet.mockImplementation((key: string) => {
      const values: Record<string, unknown> = {
        'appInsights.connectionString': 'InstrumentationKey=test',
        'service.name': 'lau-frontend',
      };

      return values[key];
    });
    const appInsights = new AppInsights();
    appInsights.enable();
    mockEmit.mockClear();

    appInsights.trackTrace({
      message: 'Something failed',
      level: 'error',
      properties: {
        requestId: 'abc-123',
      },
    });

    expect(mockEmit).toHaveBeenCalledWith(expect.objectContaining({
      body: 'Something failed',
      severityNumber: SeverityNumber.ERROR,
      severityText: 'error',
      attributes: {
        requestId: 'abc-123',
      },
    }));
  });

  it('emits errors as Azure Monitor exception log records', () => {
    mockedConfigGet.mockImplementation((key: string) => {
      const values: Record<string, unknown> = {
        'appInsights.connectionString': 'InstrumentationKey=test',
        'service.name': 'lau-frontend',
      };

      return values[key];
    });
    const appInsights = new AppInsights();
    appInsights.enable();
    mockEmit.mockClear();
    const error = new TypeError('Cannot read properties of undefined');
    error.stack = 'TypeError: Cannot read properties of undefined\n    at getTokenFromRequest';

    appInsights.trackException(error, {
      method: 'POST',
      path: '/case-search',
      statusCode: 500,
    });

    expect(mockEmit).toHaveBeenCalledWith(expect.objectContaining({
      body: 'Cannot read properties of undefined',
      severityNumber: SeverityNumber.ERROR,
      severityText: 'error',
      attributes: {
        [ATTR_EXCEPTION_TYPE]: 'TypeError',
        [ATTR_EXCEPTION_MESSAGE]: 'Cannot read properties of undefined',
        [ATTR_EXCEPTION_STACKTRACE]: 'TypeError: Cannot read properties of undefined\n    at getTokenFromRequest',
        method: 'POST',
        path: '/case-search',
        statusCode: 500,
      },
    }));
  });
});
