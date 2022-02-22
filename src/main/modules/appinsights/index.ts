import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import config from 'config';
import Sender from 'applicationinsights/out/Library/Sender';
import * as os from 'os';
import path from 'path';
import fs from 'fs';

const appInsights = require('applicationinsights');

export class AppInsights {

  private logger: LoggerInstance = Logger.getLogger(this.constructor.name);

  enable(): void {
    if (config.get('appInsights.instrumentationKey')) {
      this.createTempDir();

      this.logger.info('Starting App Insights');

      appInsights.setup(config.get<string>('appInsights.instrumentationKey'))
        .setSendLiveMetrics(true)
        .setAutoCollectConsole(true, true)
        .start();

      appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'lau-frontend';
      appInsights.defaultClient.trackTrace({message: 'App insights activated'});
    }
  }

  private createTempDir(): void {
    const tempDir = path.join(os.tmpdir(), Sender.TEMPDIR_PREFIX + config.get('appInsights.instrumentationKey'));

    if (!fs.existsSync(tempDir)) {
      this.logger.info('Creating App Insights temp dir');
      fs.mkdirSync(tempDir);
    }
  }

}
