import config from 'config';
import * as propertiesVolume from '@hmcts/properties-volume';
import { Application } from 'express';
import { get, set } from 'lodash';

export class PropertiesVolume {
  enableFor(server: Application): void {
    if (server.locals.ENV !== 'development') {
      propertiesVolume.addTo(config);
      PropertiesVolume.setSecret('secrets.lau.AppInsightsInstrumentationKey', 'appInsights.instrumentationKey');
      PropertiesVolume.setSecret('secrets.lau.frontend-redis-access-key', 'redis.password');
      PropertiesVolume.setSecret('secrets.lau.idam-client-secret', 'services.idam-api.clientSecret');
      PropertiesVolume.setSecret('secrets.lau.s2s-secret', 'services.s2s.lauSecret');
      PropertiesVolume.setSecret('secrets.lau.launchdarkly-sdk-key', 'featureToggles.ldKey');
      PropertiesVolume.setSecret('secrets.lau.lau-deleted-users-ft', 'featureToggles.ft_deletedUsers');
    }
  }

  private static setSecret(fromPath: string, toPath: string): void {
    if (config.has(fromPath)) {
      set(config, toPath, get(config, fromPath));
    }
  }

}
