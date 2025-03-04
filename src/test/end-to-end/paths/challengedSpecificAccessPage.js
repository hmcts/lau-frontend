'use strict';

const testConfig = require('../../config');
const {userType, tabs} = require('../common/Constants');
const lauHelper = require('../lauApi/lauHelper');

Feature('Challenged and Specific Access Page Check');

const logger = require('../logger');
logger.info('Running \'Challenged and Specific Access Page testing\' feature');

Scenario('Navigate to LAU, perform challenged/specific access search and check results', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);

  await lauHelper.clickNavigationLink(I, tabs.CHALLENGED_SPECIFIC_ACCESS_SEARCH);
  await I.waitForText('Challenged & specific access search', testConfig.TestTimeToWaitForText);
  await I.performCaseChallengedAccessSearch();
  await I.click('button[name="challenged-access-search-btn"]');

  await I.waitForText('Results', testConfig.TestTimeToWaitForText);
  // Asserting the text after Pagination
  await I.waitForText('Displaying 1 to 100 of 200 records', testConfig.TestTimeToWaitForText);
  const textBeforePagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textBeforePagination});
  await I.click('Next >');
  await I.waitForText('Displaying 101 to 200 of 200 records', testConfig.TestTimeToWaitForText);
  const textAfterPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textAfterPagination});
  await I.click('< Previous');
  await I.waitForText('Displaying 1 to 100 of 200 records', testConfig.TestTimeToWaitForText);
  const textLastPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textLastPagination});
}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, perform challenged/specific access search and download CSV', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.clickNavigationLink(I, tabs.CHALLENGED_SPECIFIC_ACCESS_SEARCH);
  await I.waitForText('Challenged & specific access search', testConfig.TestTimeToWaitForText);
  await I.performCaseChallengedAccessSearch();
  await I.click('button[name="challenged-access-search-btn"]');
  await I.waitForText('Results', testConfig.TestTimeToWaitForText);
  await I.handleDownloads();
  await I.click('#challendedCsvBtn');
  await I.waitForText('Generating CSV ...', testConfig.TestTimeToWaitForText);
  await I.waitForText('Download all records to CSV', testConfig.TestTimeToWaitForText);

  const csvPath = lauHelper.getCsvPath();

  await I.amInPath(csvPath.codeceptPath);
  await I.seeFile(csvPath.filename);
  lauHelper.assertCsvLineCount(csvPath.fullPath, 200);

}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, perform challenged/specific access search and authenticate error text', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.clickNavigationLink(I, tabs.CHALLENGED_SPECIFIC_ACCESS_SEARCH);
  await I.waitForText('Challenged & specific access search', testConfig.TestTimeToWaitForText);
  await I.performChallengedAccessSearchWithoutSearchData();
  await I.click('button[name="challenged-access-search-btn"]');

  await I.waitForText('Please enter at least one of the following fields: Case Ref or User ID.', testConfig.TestTimeToWaitForText);
  await I.waitForText('\'Time from\' is required.', testConfig.TestTimeToWaitForText);
  await I.waitForText('\'Time to\' is required.', testConfig.TestTimeToWaitForText);

}).retry(testConfig.TestRetryScenarios);
