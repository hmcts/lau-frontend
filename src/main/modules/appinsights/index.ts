
import { Contracts } from 'applicationinsights';
const appInsights = require('applicationinsights');

import config from 'config';
import Sender from 'applicationinsights/out/Library/Sender';
import * as os from 'os';
import path from 'path';
import fs from 'fs';

export class AppInsights {

  enable(): void {
    if (config.get('appInsights.connectionString')) {
      this.createTempDir();

      appInsights.setup(config.get<string>('appInsights.connectionString'))
        .setSendLiveMetrics(true)
        .setAutoCollectConsole(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(false) // Disable dependency tracking
        .setAutoDependencyCorrelation(false) //  Disable automatic dependency correlation
        .start();

      appInsights.defaultClient.config.samplingPercentage = config.get('appInsights.samplingPercentage');
      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'lau-frontend';
      appInsights.defaultClient.addTelemetryProcessor((envelope: Contracts.Envelope) => {
        const data = envelope.data as Contracts.Data<Contracts.RequestData>;
        return !data.baseData.url?.includes('/health/');
      });
      appInsights.defaultClient.trackTrace({message: 'App insights activated'});
    }
  }

  private createTempDir(): void {
    // pre-creating app insights tmp work directory. This should be done by app insights, but
    // for some reason in lau and pcq only, this is not happening and container crashes with
    // missing directory message.
    const instrumentationKey = this.extractInstrumentationKey(config.get('appInsights.connectionString'));
    const tempDir = path.join(os.tmpdir(), Sender.TEMPDIR_PREFIX + instrumentationKey);

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
  }

  private extractInstrumentationKey(connectionString: string): string {
    const keyValuePairs: string[][] = connectionString.split(';').map(item => item.split('='));
    const result = Object.fromEntries(keyValuePairs);
    return result['InstrumentationKey'];
  }
}
