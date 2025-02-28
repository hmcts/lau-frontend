const appInsights = require('applicationinsights');

import config from 'config';

export class AppInsights {

  enable(): void {
    if (config.get('appInsights.connectionString')) {
      console.log('App insights enabled');
      appInsights.setup(config.get<string>('appInsights.connectionString'))
        .setSendLiveMetrics(true)
        .setAutoCollectConsole(true, true)
        .setAutoCollectExceptions(true)
        .start();

      const serviceName = config.get('service.name');
      appInsights.defaultClient.config.samplingPercentage = config.get('appInsights.samplingPercentage');
      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = serviceName;
      appInsights.defaultClient.trackTrace({message: 'App insights activated'});
    }
  }
}
