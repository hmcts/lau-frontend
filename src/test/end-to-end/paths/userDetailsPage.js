'use strict';

const testConfig = require('../../config');
const {userType, tabs} = require('../common/Constants');
const lauHelper = require('../lauApi/lauHelper');

Feature('User Details Check');

const logger = require('../logger');
logger.info('Running \'User Details Page testing\' feature');

Scenario('Navigate to LAU, perform user details search and authenticate user details results', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.clickNavigationLink(I, tabs.USER_DETAILS_SEARCH);
  await I.waitForText('User details search', testConfig.TestTimeToWaitForText);
  await I.performUserDetailsSearch();
  await I.click('button[name="user-details-search-btn"]');
  
  await I.waitForText('User ID', testConfig.TestTimeToWaitForText);
  await I.waitForText('Email address', testConfig.TestTimeToWaitForText);
  await I.waitForText('Organisation address', testConfig.TestTimeToWaitForText);
  await I.waitForText('Account status', testConfig.TestTimeToWaitForText);
  await I.waitForText('Latest Activation Date (UTC)', testConfig.TestTimeToWaitForText);
  await I.waitForText('Roles', testConfig.TestTimeToWaitForText);
  await I.waitForText('Account history', testConfig.TestTimeToWaitForText);
  await I.click('details.govuk-details summary');

  await I.waitForText('Account history', testConfig.TestTimeToWaitForText);
  await I.handleDownloads();
  await I.click('button[name="download-pdf-btn"]');

  const pdfPath = await lauHelper.waitForPdfPath(10000, 500);
  await I.amInPath(pdfPath.codeceptPath);
  await I.seeFile(pdfPath.filename);
  lauHelper.assertPdfHeader(pdfPath.fullPath);
}).retry(testConfig.TestRetryScenarios);
