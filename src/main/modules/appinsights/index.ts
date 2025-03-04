const appInsights = require('applicationinsights');

import config from 'config';

export class AppInsights {

  enable(): void {
    if (config.get('appInsights.connectionString')) {
      appInsights.setup(config.get<string>('appInsights.connectionString'))
        .setSendLiveMetrics(true)
        .setAutoCollectConsole(true, true)
        .setAutoCollectExceptions(true)
        .start();

      appInsights.defaultClient.config.samplingPercentage = config.get('appInsights.samplingPercentage');
      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'lau-frontend';
      appInsights.defaultClient.trackTrace({message: 'App insights activated'});
    }
  }
}
