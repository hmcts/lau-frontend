const appInsights = require('applicationinsights');

import config from 'config';

declare global {
  var __appInsightsEnabled: boolean | undefined;
}

export class AppInsights {

  enable(): void {
    if (global.__appInsightsEnabled) {
      return;
    }
    global.__appInsightsEnabled = true;

    if (config.get('appInsights.connectionString')) {
      appInsights.setup(config.get<string>('appInsights.connectionString'))
        .setSendLiveMetrics(true)
        .setAutoCollectConsole(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(false); // Disable dependency tracking

      appInsights.defaultClient.config.samplingPercentage = config.get('appInsights.samplingPercentage');
      appInsights.defaultClient.trackTrace({message: 'App insights activated'});
      appInsights.start();
    }
  }
}
