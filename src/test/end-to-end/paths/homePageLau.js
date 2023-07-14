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
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await I.waitForText('Case Audit Search', testConfig.TestTimeToWaitForText);
  await lauHelper.selectTab(I, tabs.LOGON_SEARCH);
  await I.waitForText('Logons Audit Search', testConfig.TestTimeToWaitForText);
  await lauHelper.selectTab(I, tabs.CASE_ACTIVITY);
  await I.waitForText('Use the Search tab to conduct a search', testConfig.TestTimeToWaitForText);

}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, perform case audit search and authenticate case activity results', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.amOnPage('/');
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await I.waitForText('Case Audit Search', testConfig.TestTimeToWaitForText);
  await I.performCaseAuditSearch();
  await I.click('button[name="case-search-btn"]');
  await I.wait(10);
  await I.waitForText('Case Activity Results', testConfig.TestTimeToWaitForText);
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

Scenario('Navigate to LAU, perform case audit search and authenticate case search results', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.amOnPage('/');
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await I.waitForText('Case Audit Search', testConfig.TestTimeToWaitForText);
  await I.performCaseSearch();
  await I.click('button[name="case-search-btn"]');
  await I.wait(10);
  await lauHelper.selectTab(I, tabs.CASE_SEARCHES);
  // await I.waitForText('Case Search Results', testConfig.TestTimeToWaitForText);
  // Asserting the text after Pagination
  const textBeforePaginationOfCaseSearch = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textBeforePaginationOfCaseSearch});
  await I.waitForText('Displaying 1 to 100 of 132 records', testConfig.TestTimeToWaitForText);
  await I.click('Next >');
  await I.wait(10);
  const textAfterPaginationOfCaseSearch = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textAfterPaginationOfCaseSearch});
  await I.waitForText('Displaying 101 to 132 of 132 records', testConfig.TestTimeToWaitForText);
  await I.click('< Previous');
  await I.wait(10);
  const textPreviousPageOfCaseSearch = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textPreviousPageOfCaseSearch});
  await I.waitForText('Displaying 1 to 100 of 132 records', testConfig.TestTimeToWaitForText);


}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, perform case audit search and download CSV', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.amOnPage('/');
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await I.waitForText('Case Audit Search', testConfig.TestTimeToWaitForText);
  await I.performCaseAuditSearch();
  await I.click('button[name="case-search-btn"]');
  await I.wait(10);
  await I.waitForText('Case Activity Results', testConfig.TestTimeToWaitForText);
  await I.handleDownloads();
  await I.click('#activityCsvBtn');
  await I.wait(10);

  const csvPath = lauHelper.getCsvPath();

  await I.amInPath(csvPath.codeceptPath);
  await I.seeFile(csvPath.filename);
  lauHelper.assertCsvLineCount(csvPath.fullPath, 10000);

}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, perform case search and download CSV', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.amOnPage('/');
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await I.waitForText('Case Audit Search', testConfig.TestTimeToWaitForText);
  await I.performCaseSearch();
  await I.click('button[name="case-search-btn"]');
  await I.wait(10);
  await lauHelper.selectTab(I, tabs.CASE_SEARCHES);
  // await I.waitForText('Case Search Results', testConfig.TestTimeToWaitForText);
  await I.handleDownloads();
  await I.click('#searchesCsvBtn');
  await I.wait(10);

  const csvPath = lauHelper.getCsvPath();

  await I.amInPath(csvPath.codeceptPath);
  await I.seeFile(csvPath.filename);
  lauHelper.assertCsvLineCount(csvPath.fullPath, 132);

}).retry(testConfig.TestRetryScenarios);

//Negative Scenario for Case audit Search without search data and assert error text
Scenario('Navigate to LAU, perform case audit search and authenticate error text', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.amOnPage('/');
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await I.waitForText('Case Audit Search', testConfig.TestTimeToWaitForText);
  await I.performCaseAuditSearchWithoutSearchData();
  await I.click('button[name="case-search-btn"]');
  await I.wait(30);
  await I.waitForText('Please enter at least one of the following fields: User ID, Case Type ID, Case Ref or Jurisdiction ID.', testConfig.TestTimeToWaitForText);
  await I.waitForText('\'Time from\' is required.', testConfig.TestTimeToWaitForText);
  await I.waitForText('\'Time to\' is required.', testConfig.TestTimeToWaitForText);
}).retry(testConfig.TestRetryScenarios);
