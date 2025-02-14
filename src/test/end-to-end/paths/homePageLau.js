'use strict';

const testConfig = require('../../config');
const {userType, tabs} = require('../common/Constants');
const lauHelper = require('../lauApi/lauHelper');

Feature('Home Screen Sanity Check)');

const logger = require('../logger');
logger.info('Running \'Home Screen Sanity Check\' feature');

Scenario('Navigate to LAU, authenticate and view home screen', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);

  await I.seeInCurrentUrl(tabs.CASE_SEARCH);

  await I.waitForText('Case audit search', testConfig.TestTimeToWaitForText);
  await lauHelper.clickNavigationLink(I, tabs.LOGON_SEARCH);
  await I.waitForText('Log ons audit search', testConfig.TestTimeToWaitForText);
  await lauHelper.clickNavigationLink(I, tabs.DELETED_USERS_SEARCH);
  await I.waitForText('Deleted user search', testConfig.TestTimeToWaitForText);
}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, perform case audit search and authenticate case activity results', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await I.waitForText('Case audit search', testConfig.TestTimeToWaitForText);
  await I.performCaseAuditSearch();

  await I.click('button[name="case-search-btn"]');
  await I.waitForText('Results', testConfig.TestTimeToWaitForText);
  // Asserting the text after Pagination
  const textBeforePagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textBeforePagination});
  await I.waitForText('Displaying 1 to 100 of 10,000 records', testConfig.TestTimeToWaitForText);
  await I.waitForText('Search results are limited to 10,000.', testConfig.TestTimeToWaitForText);
  await I.click('Next >');
  await I.waitForText('Displaying 101 to 200 of 10,000 records', testConfig.TestTimeToWaitForText);
  await I.waitForText('Search results are limited to 10,000.', testConfig.TestTimeToWaitForText);
  const textAfterPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textAfterPagination});
  await I.click('Last >>');
  await I.waitForText('Displaying 9,901 to 10,000 of 10,000 records', testConfig.TestTimeToWaitForText);
  await I.waitForText('Search results are limited to 10,000.', testConfig.TestTimeToWaitForText);
  const textLastPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textLastPagination});
}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, perform case audit search and authenticate case search results', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await I.waitForText('Case audit search', testConfig.TestTimeToWaitForText);
  await I.performCaseSearch();
  await I.click('button[name="case-search-btn"]');
  await I.waitForText('Results', testConfig.TestTimeToWaitForText);
  await I.click('#tab_case-search');
  // Asserting the text after Pagination
  const textBeforePaginationOfCaseSearch = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textBeforePaginationOfCaseSearch});
  await I.waitForText('Displaying 1 to 100 of 132 records', testConfig.TestTimeToWaitForText);
  await I.click('Next >');
  await I.waitForText('Displaying 101 to 132 of 132 records', testConfig.TestTimeToWaitForText);
  const textAfterPaginationOfCaseSearch = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textAfterPaginationOfCaseSearch});
  await I.click('< Previous');
  await I.waitForText('Displaying 1 to 100 of 132 records', testConfig.TestTimeToWaitForText);
  const textPreviousPageOfCaseSearch = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textPreviousPageOfCaseSearch});
}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, perform case audit search and download CSV', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await I.waitForText('Case audit search', testConfig.TestTimeToWaitForText);
  await I.performCaseAuditSearch();
  await I.click('button[name="case-search-btn"]');
  await I.waitForText('Results', testConfig.TestTimeToWaitForText);
  await I.handleDownloads();
  await I.click('#activityCsvBtn');
  await I.waitForText('Generating CSV ...', testConfig.TestTimeToWaitForText);
  await I.waitForText('Download all records to CSV', testConfig.TestTimeToWaitForText);
  const csvPath = lauHelper.getCsvPath();

  await I.amInPath(csvPath.codeceptPath);
  await I.seeFile(csvPath.filename);
  lauHelper.assertCsvLineCount(csvPath.fullPath, 10000);

}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, perform case search and download CSV', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await I.waitForText('Case audit search', testConfig.TestTimeToWaitForText);
  await I.performCaseSearch();
  await I.click('button[name="case-search-btn"]');
  await I.waitForText('Results', testConfig.TestTimeToWaitForText);
  await I.click('#tab_case-search');
  await I.waitForText('Case search', testConfig.TestTimeToWaitForText);
  await I.handleDownloads();
  await I.click('#searchesCsvBtn');
  await I.waitForText('Generating CSV ...', testConfig.TestTimeToWaitForText);
  await I.waitForText('Download all records to CSV', testConfig.TestTimeToWaitForText);

  const csvPath = lauHelper.getCsvPath();

  await I.amInPath(csvPath.codeceptPath);
  await I.seeFile(csvPath.filename);
  lauHelper.assertCsvLineCount(csvPath.fullPath, 132);

}).retry(testConfig.TestRetryScenarios);

//Negative Scenario for Case audit Search without search data and assert error text
Scenario('Navigate to LAU, perform case audit search and authenticate error text', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await I.waitForText('Case audit search', testConfig.TestTimeToWaitForText);
  await I.performCaseAuditSearchWithoutSearchData();
  await I.click('button[name="case-search-btn"]');
  await I.waitForText('Please enter at least one of the following fields: User ID, Case Type ID, Case Ref or Jurisdiction ID.', testConfig.TestTimeToWaitForText);
  await I.waitForText('\'Time from\' is required.', testConfig.TestTimeToWaitForText);
  await I.waitForText('\'Time to\' is required.', testConfig.TestTimeToWaitForText);
}).retry(testConfig.TestRetryScenarios);
