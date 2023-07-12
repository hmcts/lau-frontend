import config from 'config';

const appInsights = require('applicationinsights');

export class AppInsights {
  enable(): void {
    if (config.get('appInsights.instrumentationKey')) {
      appInsights
        .setup(config.get('appInsights.instrumentationKey'))
        .setSendLiveMetrics(true)
        .setAutoCollectConsole(true, true)
        .setAutoCollectExceptions(true)
        .start();

      appInsights.defaultClient.addTelemetryProcessor(
        (env: any, ctx: any) =>
          ctx['http.ServerResponse']?.req.url !== '/csrf-token-error' && ctx['http.ServerResponse']?.statusCode !== 404,
      );
      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'lau-frontend';
      appInsights.defaultClient.trackTrace({message: 'App insights activated'});
    }
  }
}
