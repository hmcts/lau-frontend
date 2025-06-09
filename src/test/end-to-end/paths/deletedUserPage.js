'use strict';

const testConfig = require('../../config');
const {userType, tabs} = require('../common/Constants');
const lauHelper = require('../lauApi/lauHelper');

Feature('Deleted Users Check)');

const logger = require('../logger');
logger.info('Running \'Deleted Users Page testing\' feature');

Scenario('Navigate to LAU, perform deleted user search and authenticate deleted user results', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.clickNavigationLink(I, tabs.DELETED_USERS_SEARCH);
  await I.waitForText('Deleted user search', testConfig.TestTimeToWaitForText);
  await I.performDeletedUsersSearch();
  await I.click('button[name="user-deletions-search-btn"]');

  await I.waitForText('Results', testConfig.TestTimeToWaitForText);
  // Asserting the text after Pagination
  await I.waitForText('Displaying 1 to 100 of 200 records', testConfig.TestTimeToWaitForText);
  const textBeforePagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textBeforePagination});
  await I.click('Next page>');
  await I.waitForText('Displaying 101 to 200 of 200 records', testConfig.TestTimeToWaitForText);
  const textAfterPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textAfterPagination});
  await I.click('< Previous page');
  await I.waitForText('Displaying 1 to 100 of 200 records', testConfig.TestTimeToWaitForText);
  const textLastPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textLastPagination});
}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, perform deleted user search and download CSV', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.clickNavigationLink(I, tabs.DELETED_USERS_SEARCH);
  await I.waitForText('Deleted user search', testConfig.TestTimeToWaitForText);
  await I.performDeletedUsersSearch();
  await I.click('button[name="user-deletions-search-btn"]');
  await I.waitForText('Results', testConfig.TestTimeToWaitForText);
  await I.handleDownloads();
  await I.click('#deletedUsersCsvBtn');
  await I.waitForText('Generating CSV ...', testConfig.TestTimeToWaitForText);
  await I.waitForText('Download all records to CSV', testConfig.TestTimeToWaitForText);

  const csvPath = lauHelper.getCsvPath();

  await I.amInPath(csvPath.codeceptPath);
  await I.seeFile(csvPath.filename);
  lauHelper.assertCsvLineCount(csvPath.fullPath, 200);

}).retry(testConfig.TestRetryScenarios);

//Negative Scenario for Deleted User Search without search data and assert error text
Scenario('Navigate to LAU, perform Deleted User search and authenticate error text', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.clickNavigationLink(I, tabs.DELETED_USERS_SEARCH);
  await I.waitForText('Deleted user search', testConfig.TestTimeToWaitForText);
  await I.performDeletedUsersSearchWithoutSearchData();
  await I.click('button[name="user-deletions-search-btn"]');
  await I.waitForText('Please enter at least one of the following fields: User ID , Email, First Name or Last Name', testConfig.TestTimeToWaitForText);
  await I.waitForText('\'Time from\' is required.', testConfig.TestTimeToWaitForText);
  await I.waitForText('\'Time to\' is required.', testConfig.TestTimeToWaitForText);
}).retry(testConfig.TestRetryScenarios);
