'use strict';

const testConfig = require('../../config');
const {userType, tabs} = require('../common/Constants');
const lauHelper = require('../lauApi/lauHelper');
const idamUserHelper = require('../helpers/IdamUserHelper');
const crypto = require('crypto');
const assert = require('assert');

Feature('User Details Check');

const logger = require('../logger');
logger.info('Running \'User Details Page testing\' feature');

const featureUserEmail = `testUserDetails${crypto.randomBytes(8).toString('hex').toLowerCase()}@gmail.com`;
const featureUserPassword = 'Password13';
let testUserId;

Before(async () => {
  const createdUser = await idamUserHelper.createAUser(
    featureUserEmail,
    featureUserPassword,
    [{code: 'iud-test-worker'}],
  );
  if (createdUser && createdUser.id) {
    testUserId = createdUser.id;
    return;
  }
  throw new Error('IDAM create user response did not include id');
});

After(async () => {
  await idamUserHelper.deleteUser(featureUserEmail, featureUserPassword);
});

async function goToUserDetailsAndSearch(I) {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.clickNavigationLink(I, tabs.USER_DETAILS_SEARCH);
  await I.waitForText('User details search', testConfig.TestTimeToWaitForText);
  await I.performUserDetailsSearch(testUserId);
  await I.click('button[name="user-details-search-btn"]');
  await I.waitForText('User ID', testConfig.TestTimeToWaitForText);
}

Scenario('Navigate to LAU, perform user details search and authenticate user details results', async ({I}) => {
  await goToUserDetailsAndSearch(I);
  const displayedUserId = await I.grabTextFrom('//dt[normalize-space()="User ID"]/following-sibling::dd[1]');
  assert.strictEqual(displayedUserId.trim(), testUserId);
  await I.waitForText('Email address', testConfig.TestTimeToWaitForText);
  const displayedEmail = await I.grabTextFrom('//dt[normalize-space()="Email address"]/following-sibling::dd[1]');
  assert.strictEqual(displayedEmail.trim(), featureUserEmail);
  await I.waitForText('Organisation address', testConfig.TestTimeToWaitForText);
  await I.waitForText('Account status', testConfig.TestTimeToWaitForText);
  await I.waitForText('Latest Activation Date (UTC)', testConfig.TestTimeToWaitForText);
  await I.waitForText('Roles', testConfig.TestTimeToWaitForText);
  
  await I.click('details.govuk-details summary');
}).retry(testConfig.TestRetryScenarios);

Scenario('User Updates Search', async ({I}) => {
  await I.amOnLauAppPage('');
  await I.authenticateWithIdam(userType.AUDITOR, true);
  await I.seeInCurrentUrl(tabs.CASE_SEARCH);
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);
  await lauHelper.clickNavigationLink(I, tabs.USER_DETAILS_SEARCH);
  await I.waitForText('User details search', testConfig.TestTimeToWaitForText);
  await I.performUserUpdateSearch();
  await I.click('button[name="user-details-search-btn"]');
  await I.waitForText('Account history', testConfig.TestTimeToWaitForText);
  
  const eventNameHeader = await I.grabTextFrom(
    '//th[normalize-space()="Event name"]');
  assert.strictEqual(eventNameHeader.trim(), 'Event name');

  const updateTypeHeader = await I.grabTextFrom(
    '//th[normalize-space()="Update type"]');
  assert.strictEqual(updateTypeHeader.trim(), 'Update type');
 
  const timestampHeader = await I.grabTextFrom(
    '//th[normalize-space()="Timestamp (UTC)"]');
  assert.strictEqual(timestampHeader.trim(), 'Timestamp (UTC)');

  const changedByHeader = await I.grabTextFrom(
    '//th[normalize-space()="Changed by"]');
  assert.strictEqual(changedByHeader.trim(), 'Changed by');
  
  const previousValueHeader = await I.grabTextFrom(
    '//th[normalize-space()="Previous value"]');
  assert.strictEqual(previousValueHeader.trim(), 'Previous value'); 

}).retry(testConfig.TestRetryScenarios);


Scenario('User details PDF download', async ({I}) => {
  await goToUserDetailsAndSearch(I);
  await I.handleDownloads();
  await I.click('button[name="download-pdf-btn"]');
  const pdfPath = await lauHelper.waitForPdfPath(10000, 500);
  await I.amInPath(pdfPath.codeceptPath);
  await I.seeFile(pdfPath.filename);
  lauHelper.assertPdfHeader(pdfPath.fullPath);
}).retry(testConfig.TestRetryScenarios);
