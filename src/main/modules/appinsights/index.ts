import { AzureMonitorLogExporter } from '@azure/monitor-opentelemetry-exporter';
import { SeverityNumber, type LogAttributes, type Logger } from '@opentelemetry/api-logs';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchLogRecordProcessor, LoggerProvider } from '@opentelemetry/sdk-logs';
import {
  ATTR_EXCEPTION_MESSAGE,
  ATTR_EXCEPTION_STACKTRACE,
  ATTR_EXCEPTION_TYPE,
  ATTR_SERVICE_NAME,
} from '@opentelemetry/semantic-conventions';
import { correlation } from '../correlation';

import config from 'config';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose' | 'silly';

type Trace = string | {
  message: string;
  level?: LogLevel;
  properties?: Record<string, unknown>;
};

export class AppInsights {

  private logger?: Logger;
  private loggerProvider?: LoggerProvider;

  enable(): void {

    const connectionString = config.get<string | false>('appInsights.connectionString');

    if (connectionString) {
      const exporter = new AzureMonitorLogExporter({ connectionString });
      this.loggerProvider = new LoggerProvider({
        resource: resourceFromAttributes({
          [ATTR_SERVICE_NAME]: process.env.OTEL_SERVICE_NAME || config.get<string>('service.name'),
        }),
        processors: [
          new BatchLogRecordProcessor(exporter),
        ],
      });
      this.logger = this.loggerProvider.getLogger('lau-frontend');
      this.trackTrace('App insights activated');
    }
  }

  public trackTrace(trace: Trace): void {
    if (!this.logger) {
      console.warn('trackTrace called before AppInsights client initialised, dropped trace: ', trace);
      return;
    }

    const traceId = correlation.getTraceId();
    const message = typeof trace === 'string' ? trace : trace.message;
    const level = typeof trace === 'string' ? 'info' : trace.level || 'info';
    const properties = typeof trace === 'string' ? {} : trace.properties || {};
    const severityNumber = AppInsights.severityNumber(level);

    this.logger.emit({
      timestamp: new Date(),
      severityNumber,
      severityText: level,
      body: message,
      attributes: {
        ...AppInsights.attributes(properties),
        ...(traceId ? { traceId } : {}),
      },
    });
  }

  public trackException(error: unknown, properties: Record<string, unknown> = {}): void {
    if (!this.logger) {
      console.warn('trackException called before AppInsights client initialised, dropped exception: ', error);
      return;
    }

    const traceId = correlation.getTraceId();
    const exception = AppInsights.exceptionDetails(error);

    this.logger.emit({
      timestamp: new Date(),
      severityNumber: SeverityNumber.ERROR,
      severityText: 'error',
      body: exception.message,
      attributes: {
        ...AppInsights.attributes(properties),
        [ATTR_EXCEPTION_TYPE]: exception.type,
        [ATTR_EXCEPTION_MESSAGE]: exception.message,
        [ATTR_EXCEPTION_STACKTRACE]: exception.stack,
        ...(traceId ? { traceId } : {}),
      },
    });
  }

  public async flush(): Promise<void> {
    await this.loggerProvider?.forceFlush();
  }

  private static severityNumber(level: unknown): SeverityNumber {
    switch (level) {
      case 'error':
        return SeverityNumber.ERROR;
      case 'warn':
        return SeverityNumber.WARN;
      case 'debug':
        return SeverityNumber.DEBUG;
      case 'verbose':
      case 'silly':
        return SeverityNumber.TRACE;
      case 'info':
      default:
        return SeverityNumber.INFO;
    }
  }

  private static attributes(properties: Record<string, unknown>): LogAttributes {
    return Object.entries(properties).reduce<LogAttributes>((attributes, [key, value]) => {
      attributes[key] = AppInsights.attributeValue(value);
      return attributes;
    }, {});
  }

  private static attributeValue(value: unknown): string | number | boolean {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }

    if (value instanceof Error) {
      return JSON.stringify({
        name: value.name,
        message: value.message,
        stack: value.stack,
      });
    }

    return JSON.stringify(value);
  }

  private static exceptionDetails(error: unknown): { type: string; message: string; stack: string } {
    if (error instanceof Error) {
      return {
        type: error.name || 'Error',
        message: error.message || String(error),
        stack: error.stack || error.message || String(error),
      };
    }

    const message = typeof error === 'string' ? error : JSON.stringify(error) || String(error);

    return {
      type: 'Error',
      message,
      stack: message,
    };
  }
}

export const appInsights = new AppInsights();
