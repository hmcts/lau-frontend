'use strict';

const testConfig = require('../../config');
const {userType, tabs} = require('../common/Constants');
const lauHelper = require('../lauApi/lauHelper');

Feature('Logon Page Testing)');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
logger.info('Running \'Logon Page Testing\' feature');

Scenario('Navigate to LAU, perform logon audit search and authenticate logon search results', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.amOnPage('/');
  await I.waitForText('Log and Audit');
  await lauHelper.selectTab(I, tabs.LOGON_SEARCH);
  await I.waitForText('Logons Audit Search', testConfig.TestTimeToWaitForText);
  await I.performLogonAuditSearch();
  await I.click('//button[@name="case-search-btn"]');
  await I.wait(5);
  await I.waitForText('Logons Audit Results');
  await I.waitForText(' Results returned have been capped at 10,000.');
  await I.waitForText(' Page 1 / 100 ');
  await I.click('Next >');
  await I.wait(10);
  await I.waitForText(' Page 2 / 100 ');
  await I.click('Last >>');
  await I.wait(10);
  await I.waitForText(' Page 100 / 100 ');

}).retry(testConfig.TestRetryScenarios);
