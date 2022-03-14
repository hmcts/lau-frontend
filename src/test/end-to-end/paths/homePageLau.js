'use strict';

const testConfig = require('../../config');
const {userType, tabs} = require('../common/Constants');
const lauHelper = require('../lauApi/lauHelper');

Feature('Home Screen Sanity Check)');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
logger.info('Running \'Home Screen Sanity Check\' feature');

Scenario('Navigate to LAU, authenticate and view home screen', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.amOnPage('/');
  await I.waitForText('Log and Audit');
  await I.waitForText('Case Audit Search', testConfig.TestTimeToWaitForText);
  await lauHelper.selectTab(I, tabs.LOGON_SEARCH);
  await I.waitForText('Logons Audit Search', testConfig.TestTimeToWaitForText);
  await lauHelper.selectTab(I, tabs.CASE_ACTIVITY);
  await I.waitForText('Use the Search tab to conduct a search', testConfig.TestTimeToWaitForText);
}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, authenticate and perform case audit search', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.amOnPage('/');
  await I.waitForText('Log and Audit');
  await I.waitForText('Case Audit Search', testConfig.TestTimeToWaitForText);
  await I.performCaseAuditSearch();
}).retry(testConfig.TestRetryScenarios);


