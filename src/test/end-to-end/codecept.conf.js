import {randomBytes} from 'node:crypto';
import testConfig from '../config.cjs';
import idamUserHelper from './helpers/IdamUserHelper.js';

const auditorUser = `auditor${randomBytes(8).toString('hex').toLowerCase()}@gmail.com`;
const testPassword = 'Password12';

export default {
  noGlobals: true,
  async bootstrapAll() {
    await idamUserHelper.createAUser(auditorUser, testPassword);
  },
  async teardownAll() {
    await idamUserHelper.deleteUser(auditorUser);
  },
  'tests': testConfig.TestPathToRun,
  'output': testConfig.TestOutputDir,
  'helpers': {
    'Playwright': {
      url: testConfig.TestEndToEndUrl,
      browser: 'chromium',
      show: testConfig.TestShowBrowserWindow,
      timeout: 30_000,
      waitForTimeout: 30_000,
      getPageTimeout: 30_000,
      windowSize: '1280x960',
      ignoreHTTPSErrors: true,
      restart: 'context',
      chromium: {
        args: [
          '--no-sandbox',
          '--allow-running-insecure-content',
        ],
      },
    },
    'PlaywrightHelper': {
      require: './helpers/PlaywrightHelper.js',
    },
    'FileSystem': {},
  },
  'include': {
    'I': './pages/steps.js',
  },
  'plugins': {
    'autoDelay': {
      'enabled': testConfig.TestAutoDelayEnabled,
    },
    'screenshot': {
      'enabled': true,
      'on': 'fail',
      'fullPageScreenshots': true,
      'uniqueScreenshotNames': true,
    },
    'retryFailedStep': {
      'enabled': testConfig.TestRetryFailedStepEnabled,
      'retries': 2,
    },
  },
  'multiple': {
    'parallel': {
      // Don't split tests into chunks, causes race conditions for downloads
      'chunks': 1,
    },
  },
  'mocha': {
    'reporterOptions': {
      reportDir: testConfig.TestOutputDir,
      reportName: 'index',
      reportTitle: 'Functional Test results',
      inlineAssets: true,
    },
  },
  'name': 'LAU Codecept Tests',
};
