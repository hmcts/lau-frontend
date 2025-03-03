const appInsights = require('applicationinsights');

import config from 'config';

export class AppInsights {

  enable(): void {
    const connString: string = config.get('appInsights.connectionString');
    this.logConnString(connString);
    if (connString) {
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

  logConnString(connString: string): void {
    if (connString) {
      const parts = connString.split(';');
      const keyValues = parts
        .map((part: string) => part.split('='))
        .reduce((res: {[key:string]: string}, pair) => {
          res[pair[0]] = pair[1];
          return res;
        }, {});
      console.warn('logdebug application id:', keyValues['ApplicationId']);
      console.warn('logdebug ingestion point:', keyValues['IngestionEndpoint']);
    }
  }
}
