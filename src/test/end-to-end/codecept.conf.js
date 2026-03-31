const testConfig = require('src/test/config.js');
const idamHelper = require('./lauApi/idamHelper');

const auditorUser = `auditor${require('crypto').randomBytes(8).toString('hex').toLowerCase()}@gmail.com`;
const testPassword = 'Password12';
const idamClientSecret = process.env.IDAM_CLIENT_SECRET;
let testUserId;

exports.config = {
  async bootstrapAll() {
    process.env.USER_EMAIL = auditorUser;
    process.env.USER_PASSWORD = testPassword;
    const createAccessToken = await idamHelper.clientCredentialsAccessToken(idamClientSecret,'create-active-user');
    const createdUser = await idamHelper.createUser(createAccessToken, auditorUser, testPassword);
    if (createdUser && createdUser.id) {
      testUserId = createdUser.id;
    }

  },
  async teardownAll() {
     const deleteAccessToken = await idamHelper.clientCredentialsAccessToken(idamClientSecret,'delete-user');
     await idamHelper.deleteUser(deleteAccessToken, testUserId);
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
    'Mochawesome': {
      uniqueScreenshotNames: true,
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
    'screenshotOnFail': {
      'enabled': true,
      'fullPageScreenshots': true,
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
