const appInsights = require('applicationinsights');

import config from 'config';

export class AppInsights {

  enable(): void {
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
