import {LaunchDarklyClient} from '../../../main/components/featureToggle/LaunchDarklyClient';

describe('LaunchDarklyClient', () => {
  it('initialises the client', async () => {
    LaunchDarklyClient.initialise();
    expect(LaunchDarklyClient.instance).toBeDefined();
  });
  it('successfully calls and returns truthy variation value', async () => {
    const testFeature = await LaunchDarklyClient.instance.variation('test', true);
    expect(testFeature).toBeTruthy();
  });
  it('successfully calls and returns falsy variation value', async () => {
    const testFeature = await LaunchDarklyClient.instance.variation('test', false);
    expect(testFeature).toBeFalsy();
  });
});
