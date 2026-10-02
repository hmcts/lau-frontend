import testConfig from '../../config.cjs';
import {userType, tabs} from '../common/Constants.js';
import lauHelper from '../lauApi/lauHelper.js';
import logger from '../logger.js';

Feature('Challenged and Specific Access Page Check');

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
  await I.click('Next page>');
  await I.waitForText('Displaying 101 to 200 of 200 records', testConfig.TestTimeToWaitForText);
  const textAfterPagination = await I.grabTextFromAll('div[class="flex-space-between"] p');
  logger.info({message: 'the text is ', textAfterPagination});
  await I.click('< Previous page');
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
  const csvPath = await I.downloadFile('#challendedCsvBtn');

  await I.waitForText('Generating CSV ...', testConfig.TestTimeToWaitForText);
  await I.waitForText('Download all records to CSV', testConfig.TestTimeToWaitForText);
  lauHelper.assertCsvLineCount(csvPath, 200);

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
