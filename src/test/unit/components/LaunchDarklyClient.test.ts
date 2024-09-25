import {LaunchDarklyClient} from '../../../main/components/featureToggle/LaunchDarklyClient';
import { FeatureToggleService } from '../../../main/service/FeatureToggleService';
import config from 'config';

jest.mock('config');

describe('LaunchDarklyClient', () => {

  beforeEach(() => {
    // Initialize the LaunchDarklyClient with the mock LDClientInterface
    LaunchDarklyClient.initialise();
  });

  it('initialises the client', async () => {
    expect(LaunchDarklyClient.instance).toBeDefined();
  });
  it('successfully calls and returns truthy variation value', async () => {
    // Simulate LDClient variation method returning true
    jest.spyOn(LaunchDarklyClient.instance, 'variation').mockResolvedValue(true);

    const testFeature = await LaunchDarklyClient.instance.variation('test', true);
    expect(testFeature).toBeTruthy();
  });
  it('successfully calls and returns falsy variation value', async () => {
    // Simulate LDClient variation method returning false
    jest.spyOn(LaunchDarklyClient.instance, 'variation').mockResolvedValue(false);

    const testFeature = await LaunchDarklyClient.instance.variation('test', false);
    expect(testFeature).toBeFalsy();
  });
  it('successfully calls and returns true variation value when enviornment is development', async () => {
    (config.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'is_dev') return 'true';
      if (key === 'featureToggles.ft_challengeAccess') return 'ft_challengeAccess';
      return null;
    });
    // Simulate LDClient variation method returning true when development environment
    jest.spyOn(LaunchDarklyClient.instance, 'variation').mockResolvedValue(true);

    const result = await FeatureToggleService.getChallengedAccessFeatureToggle();
    expect(result).toBeTruthy();
  });
  it('successfully calls and returns false variation value when enviornment is production', async () => {
    (config.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'is_dev') return 'false';
      if (key === 'featureToggles.ft_challengeAccess') return 'ft_challengeAccess';
      return null;
    });
    // Simulate LDClient variation method returning true when development environment
    jest.spyOn(LaunchDarklyClient.instance, 'variation').mockResolvedValue(false);

    const result = await FeatureToggleService.getChallengedAccessFeatureToggle();
    expect(result).toBeFalsy();
  
  });
});
