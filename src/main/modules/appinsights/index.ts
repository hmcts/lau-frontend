import * as appInsights from 'applicationinsights';
import type { TelemetryClient } from 'applicationinsights';

import config from 'config';

export class AppInsights {

  private client: TelemetryClient;

  enable(): void {

    if (config.get('appInsights.connectionString')) {
      appInsights.setup(config.get<string>('appInsights.connectionString'))
        .setSendLiveMetrics(false)
        .setAutoCollectConsole(false)
        .setAutoCollectPerformance(false, false)
        .setAutoCollectDependencies(false); // Disable dependency tracking

      this.client = appInsights.defaultClient;
      this.client.config.samplingPercentage = config.get('appInsights.samplingPercentage');
      this.client.trackTrace({message: 'App insights activated'});
      appInsights.start();
    }
  }

  public trackTrace(trace: string | {'message': string}) {
    if (!this.client) {
      console.warn('trackTrace called before AppInsights client initialised, dropped trace: ', trace);
      return;
    }
    if (typeof trace === 'string') {
      this.client.trackTrace({message: trace});
    } else {
      this.client.trackTrace(trace);
    }
  }
}
