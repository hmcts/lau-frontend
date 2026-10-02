import CONF from 'config';

export const config = {
  noGlobals: true,
  output: process.cwd() + '/smoke-output',
  helpers: {
    'Playwright': {
      url: CONF.testUrl,
      browser: 'chromium',
      show: false,
      windowSize: '1280x960',
      ignoreHTTPSErrors: true,
      restart: 'context',
      chromium: {
        args: [
          '--no-sandbox',
          `--proxy-server=${process.env.E2E_PROXY_SERVER || ''}`,
          `--proxy-bypass-list=${process.env.E2E_PROXY_BYPASS || ''}`,
          '--allow-running-insecure-content',
        ],
      },
    },
  },
  include: { I: './stepsFile.js' },
  gherkin: {
    features: 'features/smoke.feature',
    steps: ['./steps/smoke.js'],
  },
  name: 'lau-frontend',
};
