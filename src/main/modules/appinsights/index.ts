import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import config from 'config';

const appInsights = require('applicationinsights');

export class AppInsights {

  private logger: LoggerInstance = Logger.getLogger(this.constructor.name);

  enable(): void {
    if (config.get('appInsights.instrumentationKey')) {
      this.logger.info('Starting App Insights');

      appInsights.setup(config.get<string>('appInsights.instrumentationKey'))
        .setSendLiveMetrics(true)
        .setAutoCollectConsole(true, true)
        .setUseDiskRetryCaching(false)
        .start();

      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'lau-frontend';
      appInsights.defaultClient.trackTrace({message: 'App insights activated'});
    }
  }

}
