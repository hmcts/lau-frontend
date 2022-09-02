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
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.selectTab(I, tabs.LOGON_SEARCH);
  await I.waitForText('Logons Audit Search', testConfig.TestTimeToWaitForText);
  await I.performLogonAuditSearch();
  await I.click('button[name="logon-search-btn"]');
  await I.wait(5);
  await I.waitForText('Logons Audit Results', testConfig.TestTimeToWaitForText);
  // Asserting the text after Pagination
  const textBeforePagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textBeforePagination});
  await I.waitForText('Displaying 1 to 100 of 10,000 records', testConfig.TestTimeToWaitForText);
  await I.waitForText('Note: Results returned have been capped at 10,000.', testConfig.TestTimeToWaitForText);
  await I.click('Next >');
  await I.wait(10);
  const textAfterPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textAfterPagination});
  await I.waitForText('Displaying 101 to 200 of 10,000 records', testConfig.TestTimeToWaitForText);
  await I.waitForText('Note: Results returned have been capped at 10,000.', testConfig.TestTimeToWaitForText);
  await I.click('Last >>');
  await I.wait(10);
  const textLastPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textLastPagination});
  await I.waitForText('Displaying 9,901 to 10,000 of 10,000 records', testConfig.TestTimeToWaitForText);
  await I.waitForText('Note: Results returned have been capped at 10,000.', testConfig.TestTimeToWaitForText);


}).retry(testConfig.TestRetryScenarios);


Scenario('Navigate to LAU, perform logon audit search and download CSV', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.amOnPage('/');
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.selectTab(I, tabs.LOGON_SEARCH);
  await I.wait(10);
  await I.waitForText('Logons Audit Search', testConfig.TestTimeToWaitForText);
  await I.performLogonAuditSearch();
  await I.click('button[name="logon-search-btn"]');
  await I.wait(10);
  await I.waitForText('Logons Audit Results', testConfig.TestTimeToWaitForText);
  await I.handleDownloads();
  await I.click('#logonsCsvBtn');
  await I.wait(10);

  const csvPath = lauHelper.getCsvPath();

  await I.amInPath(csvPath.codeceptPath);
  await I.seeFile(csvPath.filename);
  lauHelper.assertCsvLineCount(csvPath.fullPath, 10000);

}).retry(testConfig.TestRetryScenarios);

//Negative Scenario for Logons audit Search without search data and assert error text
Scenario('Navigate to LAU, perform logon audit search without search parameters', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.amOnPage('/');
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.selectTab(I, tabs.LOGON_SEARCH);
  await I.waitForText('Logons Audit Search', testConfig.TestTimeToWaitForText);
  await I.performLogonAuditSearchWithoutSearchData();
  await I.click('button[name="logon-search-btn"]');
  await I.wait(10);
  await I.waitForText('Please enter at least one of the following fields: User ID or Email', testConfig.TestTimeToWaitForText);
  await I.waitForText('\'Time from\' is required.', testConfig.TestTimeToWaitForText);
  await I.waitForText('\'Time to\' is required.', testConfig.TestTimeToWaitForText);
}).retry(testConfig.TestRetryScenarios);
