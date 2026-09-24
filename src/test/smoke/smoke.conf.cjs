require('ts-node/register');
const CONF = require('config');

exports.config = {
  output: process.cwd() + '/smoke-output',
  helpers: {
    Puppeteer: {
      url: CONF.testUrl,
      show: false,
      headless: false,
      chrome: {
        'ignoreHTTPSErrors': true,
        'ignore-certificate-errors': true,
        'defaultViewport': {
          'width': 1280,
          'height': 960,
        },
        args: [
          '--no-sandbox',
          `--proxy-server=${process.env.E2E_PROXY_SERVER || ''}`,
          `--proxy-bypass-list=${process.env.E2E_PROXY_BYPASS || ''}`,
          '--window-size=1440,1400',
        ],
      },
    },
  },
  include: { I: './stepsFile.ts' },
  gherkin: {
    features: 'features/smoke.feature',
    steps: ['./steps/smoke.ts'],
  },
  bootstrap: null,
  teardown: null,
  hooks: [],
  name: 'lau-frontend',
};
