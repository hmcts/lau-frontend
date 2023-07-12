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
        (env, ctx) =>
          ctx['http.ServerResponse']?.req.url !== '/csrf-token-error' && ctx['http.ServerResponse']?.statusCode !== 404,
      );
      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'nfdiv-frontend';
      appInsights.defaultClient.trackTrace({message: 'App insights activated'});
    }
  }
}
