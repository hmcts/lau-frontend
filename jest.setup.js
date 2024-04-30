jest.mock('launchdarkly-node-server-sdk', () => {
  const LDClientMock = {
    init: jest.fn().mockImplementation((sdkKey, options) => ({
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'ready') {
          setTimeout(callback, 0);
        }
      }),
      variation: jest.fn().mockImplementation((featureKey, user, defaultVal, callback) => {
        // Mock your variation method behavior here
        // For example, return 'true' for all features
        callback(null, true);
      }),
      once: jest.fn().mockImplementation((event, callback) => {
        // Mock your once method behavior here
        // For example, execute the callback directly
        if (event === 'ready') {
          setTimeout(callback, 0);
        }
      }),
    })),
  };

  return LDClientMock;
});