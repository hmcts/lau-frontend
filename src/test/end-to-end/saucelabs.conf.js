const supportedBrowsers = require('../crossbrowser/supportedBrowsers.js');
const testConfig = require('../config');
const idamHelper = require('./lauApi/idamHelper');

const auditorUser = `auditor${require('crypto').randomBytes(8).toString('hex').toLowerCase()}@gmail.com`;
const testPassword = 'genericPassword123';
const idamClientSecret = process.env.IDAM_CLIENT_SECRET;
let testUserId;

const waitForTimeout = parseInt(process.env.WAIT_FOR_TIMEOUT) || 45000;
const smartWait = parseInt(process.env.SMART_WAIT) || 30000;
const browser = process.env.BROWSER_GROUP || 'chrome';
const defaultSauceOptions = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
  acceptSslCerts: true,
  windowSize: '1600x900',
  tags: ['lau'],
};

function merge(intoObject, fromObject) {
  return Object.assign({}, intoObject, fromObject);
}

function getBrowserConfig(browserGroup) {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
      candidateCapabilities['sauce:options'] = merge(
        defaultSauceOptions, candidateCapabilities['sauce:options'],
      );
      browserConfig.push({
        browser: candidateCapabilities.browserName,
        capabilities: candidateCapabilities,
      });
    } else {
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return browserConfig;
}

const setupConfig = {
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
  'output': `${process.cwd()}/${testConfig.TestOutputDir}`,
  'helpers': {
    WebDriver: {
      url: testConfig.TestEndToEndUrl,
      browser,
      smartWait,
      waitForTimeout,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      capabilities: {},
    },
    WebDriverHelper: {
      require: './helpers/WebDriverHelper.js',
    },
    SauceLabsReportingHelper: {
      require: './helpers/SauceLabsReportingHelper.js',
    },
    JSWait: {
      require: './helpers/JSWait.js',
    },
    Mochawesome: {
      uniqueScreenshotNames: 'true',
    },
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2,
    },
    autoDelay: {
      enabled: testConfig.TestAutoDelayEnabled,
      delayAfter: 2000,
    },
  },
  include: {
    I: './pages/steps.js',
  },

  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: {steps: true},
      },
      'mocha-junit-reporter': {
        stdout: '-',
        options: {mochaFile: `${testConfig.TestOutputDir}/result.xml`},
      },
      mochawesome: {
        stdout: testConfig.TestOutputDir + '/console.log',
        options: {
          reportDir: testConfig.TestOutputDir,
          reportName: 'index',
          reportTitle: 'Crossbrowser results for: ' + browser.toUpperCase(),
          inlineAssets: true,
        },
      },
    },
  },
  multiple: {
    microsoft: {
      browsers: getBrowserConfig('microsoft'),
    },
    chrome: {
      browsers: getBrowserConfig('chrome'),
    },
    firefox: {
      browsers: getBrowserConfig('firefox'),
    },
    safari: {
      browsers: getBrowserConfig('safari'),
    },
  },
  name: 'LAU Cross-Browser Tests',
};

exports.config = setupConfig;
