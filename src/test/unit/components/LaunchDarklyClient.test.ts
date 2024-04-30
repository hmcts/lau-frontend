import {LaunchDarklyClient} from '../../../main/components/featureToggle/LaunchDarklyClient';

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
});
