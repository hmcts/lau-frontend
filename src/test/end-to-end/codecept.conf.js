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
    'Puppeteer': {
      'url': testConfig.TestEndToEndUrl,
      'waitForTimeout': 90000,
      'getPageTimeout': 90000,
      // 'waitForAction': 1,
      'show': testConfig.TestShowBrowserWindow,
      'waitForNavigation': ['domcontentloaded'],
      'chrome': {
        'ignoreHTTPSErrors': true,
        'ignore-certificate-errors': true,
        'defaultViewport': {
          'width': 1280,
          'height': 960,
        },
        args: [
          // '--headless',
          '--disable-gpu',
          '--no-sandbox',
          '--allow-running-insecure-content',
          '--ignore-certificate-errors',
          '--window-size=1440,1400',
        ],
      },

    },
    'PuppeteerHelper': {
      'require': './helpers/PuppeteerHelper.js',
    },
    'JSWait': {
      require: './helpers/JSWait.js',
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
      'enabled': true,
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
      mochawesome: {
        stdout: testConfig.TestOutputDir + '/console.log',
        options: {
          reportDir: testConfig.TestOutputDir,
          reportName: 'index',
          reportTitle: 'Functional Test results',
          inlineAssets: true,
        },
      },
    },
  },
  'name': 'LAU Codecept Tests',
};
