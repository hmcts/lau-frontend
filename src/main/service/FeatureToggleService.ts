import config from 'config';
import {LaunchDarklyClient} from '../components/featureToggle/LaunchDarklyClient';

export class FeatureToggleService{
  public static async getDeletedUsersFeatureToggle(): Promise<void> {
    const deletedUsersFt = String(config.get('featureToggles.ft_deletedUsers'));
    const deletedUsersFtValue = await LaunchDarklyClient.instance.variation(deletedUsersFt, false);
    return deletedUsersFtValue;
  }

  public static async getChallengedAccessFeatureToggle(): Promise<void> {
    const is_development = Boolean(config.get('is_dev'));
    const challengedAccessFt = String(config.get('featureToggles.ft_challengeAccess'));
    return await LaunchDarklyClient.instance.variation(challengedAccessFt, is_development);
  }
}
