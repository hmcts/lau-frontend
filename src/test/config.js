module.exports = {
  TestEndToEndUrl: process.env.TEST_E2E_URL || 'https://lau.aat.platform.hmcts.net/',
  TestFrontEndUrl: process.env.TEST_FRONT_END_URL || 'https://lau.aat.platform.hmcts.net/',
  TestShowBrowserWindow: process.env.SHOW_BROWSER_WINDOW || false,
  TestRetryFeatures: process.env.RETRY_FEATURES || 0,
  TestRetryScenarios: process.env.RETRY_SCENARIOS || 2,
  TestPathToRun: process.env.E2E_TEST_PATH || './paths/**/*.js',
  TestOutputDir: process.env.E2E_OUTPUT_DIR || './functional-output',
  TestTimeToWaitForText: parseInt(process.env.E2E_TEST_TIME_TO_WAIT_FOR_TEXT || 10),
  TestAutoDelayEnabled: process.env.E2E_AUTO_DELAY_ENABLED === 'true',
  TestForAccessibility: process.env.TESTS_FOR_ACCESSIBILITY === 'true',
  TestForCrossBrowser: process.env.TESTS_FOR_CROSS_BROWSER === 'true',
  Auditor: {
    password: process.env.USER_PASSWORD,
    email: process.env.USER_EMAIL,
  },
  url: {
    authProviderApi: process.env.SERVICE_AUTH_PROVIDER_API_BASE_URL || 'http://rpe-service-auth-provider-aat.service.core-compute-aat.internal',
    idamApi: process.env.IDAM_API_URL || 'https://idam-api.aat.platform.hmcts.net',
  },
  s2s: {
    microservice: process.env.S2S_MICROSERVICE_KEY_CMC,
    secret: process.env.S2S_MICROSERVICE_KEY_PWD,
  },
  featureToggles: {
    enabled: process.env.LD_ENABLED || false,
    launchDarklyKey: process.env.LAUNCHDARKLY_KEY,
    flags: {},
  },
  env: process.env.TEST_ENV || 'local',
  proxy: '',
};
