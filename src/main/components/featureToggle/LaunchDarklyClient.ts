import {LoggerInstance} from 'winston';
import LaunchDarklySDK from 'launchdarkly-node-server-sdk';
import config from 'config';
import {AppError, ErrorCode} from '../../models/AppError';

const {Logger} = require('@hmcts/nodejs-logging');

export class LaunchDarklyClient {

  private logger: LoggerInstance = Logger.getLogger('LaunchDarklyClient');

  private static _instance: LaunchDarklyClient;
  private client: LaunchDarklySDK.LDClient;

  private ready = false;

  private constructor() {
    const options = config.get('featureToggles.enabled') ? {diagnosticOptOut: true} : {offline: true};
    this.client = LaunchDarklySDK.init(config.get('featureToggles.ldKey'), options);
    this.client.once('ready', () => {
      this.ready = true;
    });
  }

  public static initialise(): void {
    if (!this._instance) {
      this._instance = new this();
    }
  }

  public static get instance(): LaunchDarklyClient {
    return this._instance || (this._instance = new this());
  }

  async variation(featureKey: string, offlineDefault = false): Promise<LaunchDarklySDK.LDFlagValue> {
    return new Promise((resolve, reject) => {

      const variation = () => {
        this.client.variation(featureKey, {key: 'lau-frontend'}, offlineDefault, (err, enabled) => {
          this.logger.info(`Checking feature toggle: ${featureKey}, isEnabled: ${enabled}`);

          if (err) {
            reject(new AppError(err, ErrorCode.LAUNCH_DARKLY));
          } else {
            resolve(enabled);
          }
        });
      };

      if (this.ready) {
        variation();
      } else {
        this.client.once('ready', () => {
          variation();
        });
      }
    });
  }

}
