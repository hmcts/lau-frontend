import config from 'config';
import { LaunchDarklyClient } from '../components/featureToggle/LaunchDarklyClient';

export class FeatureToggleService{
  public async getDeletedUsersFeatureToggle(): Promise<void> {
    const deletedUsersFt = String(config.get('featureToggles.ft_deletedUsers'));
    const deletedUsersFtValue = await LaunchDarklyClient.instance.variation(deletedUsersFt, false);
    return deletedUsersFtValue;
  }
    
}