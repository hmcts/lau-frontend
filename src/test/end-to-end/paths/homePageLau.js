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

Scenario('Navigate to LAU, perform case audit search and authenticate case activity results', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.amOnPage('/');
  await I.waitForText('Log and Audit');
  await I.waitForText('Case Audit Search', testConfig.TestTimeToWaitForText);
  await I.performCaseAuditSearch();
  await I.click('//button[@name="case-search-btn"]');
  await I.wait(5);
  await I.waitForText('Case Activity Results');
  // Asserting the text after Pagination
  //Asserting the CSV after hitting download button
  const textBeforePagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textBeforePagination});
  // await I.waitForText('Displaying 1 to 100 of 10,000 records, Note: Results returned have been capped at 10,000.');
  await I.click('Next >');
  await I.wait(10);
  const textAfterPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textAfterPagination});
  // await I.waitForText('Displaying 2 to 100 of 10,000 records, Note: Results returned have been capped at 10,000.');
  await I.click('Last >>');
  await I.wait(10);
  const textLastPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textLastPagination});
  // await I.waitForText('Displaying 100 to 100 of 10,000 records, Note: Results returned have been capped at 10,000.');

}).retry(testConfig.TestRetryScenarios);

Scenario('Navigate to LAU, perform case audit search and authenticate case search results', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);

  await I.amOnPage('/');
  await I.waitForText('Log and Audit');
  await I.waitForText('Case Audit Search', testConfig.TestTimeToWaitForText);
  await I.performCaseSearch();
  await I.click('//button[@name="case-search-btn"]');
  await I.wait(10);
  await lauHelper.selectTab(I, tabs.CASE_SEARCHES);
  await I.waitForText('Case Searches Results');
  await I.waitForText(' Page 1 / 2 ');
  await I.click('Next >');
  await I.wait(20);
  await I.waitForText('Case Searches Results');
  await I.waitForText(' Page 2 / 2 ');

}).retry(testConfig.TestRetryScenarios);


