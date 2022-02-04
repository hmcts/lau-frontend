import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import config from 'config';

const appInsights = require('applicationinsights');

export class AppInsights {

  private logger: LoggerInstance = Logger.getLogger(this.constructor.name);

  enable(): void {
    if (config.get('appInsights.instrumentationKey')) {
      this.logger.info('Starting App Insights');

      appInsights.setup(config.get('appInsights.instrumentationKey'))
        .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
        .setSendLiveMetrics(true)
        .setAutoCollectConsole(true, true)
        .setAutoCollectExceptions(true)
        .setInternalLogging(true)
        .start();

      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'lau-frontend';
      appInsights.defaultClient.trackTrace({message: 'App insights activated'});
    }
  }

}
