import config from 'config';
import {LaunchDarklyClient} from '../components/featureToggle/LaunchDarklyClient';

export class FeatureToggleService{

  public static async getChallengedAccessFeatureToggle(): Promise<void> {
    const isDevelopment = Boolean(config.get('is_dev'));
    const challengedAccessFt = String(config.get('featureToggles.ft_challengeAccess'));
    return await LaunchDarklyClient.instance.variation(challengedAccessFt, isDevelopment);
  }
}
