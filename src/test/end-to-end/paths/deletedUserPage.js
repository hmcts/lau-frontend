'use strict';

const testConfig = require('../../config');
const {userType, tabs} = require('../common/Constants');
const lauHelper = require('../lauApi/lauHelper');

Feature('Deleted Users Check)');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
logger.info('Running \'Deleted Users Page testing\' feature');

Scenario('Navigate to LAU, perform deleted user search and authenticate deleted user results', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.amOnPage('/');
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.selectTab(I, tabs.DELETED_USERS_SEARCH);
  await I.waitForText('Deleted Users Search', testConfig.TestTimeToWaitForText);
  await I.performDeletedUsersSearch();
  await I.click('button[name="user-deletions-search-btn"]');
  await I.wait(10);
  await I.waitForText('Deleted Users Results', testConfig.TestTimeToWaitForText);
  // Asserting the text after Pagination
  const textBeforePagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textBeforePagination});
  await I.waitForText('Displaying 1 to 100 of 200 records', testConfig.TestTimeToWaitForText);
  //await I.waitForText('Note: Results returned have been capped at 10,000.', testConfig.TestTimeToWaitForText);
  await I.click('Next >');
  await I.wait(10);
  const textAfterPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textAfterPagination});
  await I.waitForText('Displaying 101 to 200 of 200 records', testConfig.TestTimeToWaitForText);
  //await I.waitForText('Note: Results returned have been capped at 10,000.', testConfig.TestTimeToWaitForText);
  await I.click('< Previous');
  await I.wait(10);
  const textLastPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textLastPagination});
  await I.waitForText('Displaying 1 to 100 of 200 records', testConfig.TestTimeToWaitForText);
  //await I.waitForText('Note: Results returned have been capped at 10,000.', testConfig.TestTimeToWaitForText);
}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, perform deleted user search and download CSV', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.amOnPage('/');
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.selectTab(I, tabs.DELETED_USERS_SEARCH);
  await I.waitForText('Deleted Users Search', testConfig.TestTimeToWaitForText);
  await I.performDeletedUsersSearch();
  await I.click('button[name="user-deletions-search-btn"]');
  await I.wait(10);
  //await lauHelper.selectTab(I, tabs.DELETED_USERS_RESULT);
  await I.waitForText('Deleted Users Results', testConfig.TestTimeToWaitForText);
  await I.handleDownloads();
  await I.click('#deletedUsersCsvBtn');
  await I.wait(10);

  const csvPath = lauHelper.getCsvPath();

  await I.amInPath(csvPath.codeceptPath);
  await I.seeFile(csvPath.filename);
  lauHelper.assertCsvLineCount(csvPath.fullPath, 200);

}).retry(testConfig.TestRetryScenarios);

//Negative Scenario for Deleted User Search without search data and assert error text
Scenario('Navigate to LAU, perform Deleted User search and authenticate error text', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.amOnPage('/');
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.selectTab(I, tabs.DELETED_USERS_SEARCH);
  await I.waitForText('Deleted Users Search', testConfig.TestTimeToWaitForText);
  await I.performDeletedUsersSearchWithoutSearchData();
  await I.click('button[name="user-deletions-search-btn"]');
  await I.wait(10);
  await I.waitForText('Please enter at least one of the following fields: User ID , Email, First Name or Last Name', testConfig.TestTimeToWaitForText);
  await I.waitForText('\'Time from\' is required.', testConfig.TestTimeToWaitForText);
  await I.waitForText('\'Time to\' is required.', testConfig.TestTimeToWaitForText);
}).retry(testConfig.TestRetryScenarios);
