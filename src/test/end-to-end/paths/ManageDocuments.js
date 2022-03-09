'use strict';

const caseHelper = require('../ccdApi/caseHelper');
const apiRequest = require('../claimStoreApi/apiRequest.js');
const {userType} = require('../common/Constants');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const testConfig = require('src/test/config.js');

Feature('ManageDocuments functionality').retry(testConfig.TestRetryFeatures);

xScenario('Claimant create a case --> Caseworker submit Manage Document Other', async ({I}) => {
    await I.amOnCitizenAppPage('');
    await I.authenticateWithIdam(userType.CITIZEN, true);
    const claimRef = await I.createClaimDefendantAsOrg();
    await I.click('Sign out');

    logger.info({message: 'Created a claim in ccd with claim ref: ', claimRef});

    const claim = await apiRequest.retrieveByReferenceNumber(claimRef);
    const caseId = claim.ccdCaseId;

    //login as caseworker and verify created event
    await I.authenticateWithIdam(userType.CASEWORKER);
    await I.amOnPage(`/case/${testConfig.definition.jurisdiction}/${testConfig.definition.caseType}/` + caseId);
    await I.waitForText('Claim created by citizen');
    await I.see('Claim submitted');
    await caseHelper.manageDocumentsEventTriggered(I, 'Other');
}).retry(testConfig.TestRetryScenarios);

xScenario('Claimant create a case --> Caseworker submit manage Document Correspondance', async ({I}) => {
    await I.amOnCitizenAppPage('');
    await I.authenticateWithIdam(userType.CITIZEN, true);
    const claimRef = await I.createClaimDefendantAsOrg();
    await I.click('Sign out');

    logger.info({message: 'Created a claim in ccd with claim ref: ', claimRef});

    const claim = await apiRequest.retrieveByReferenceNumber(claimRef);
    const caseId = claim.ccdCaseId;

    //login as caseworker and verify created event
    await I.authenticateWithIdam(userType.CASEWORKER);
    await I.amOnPage(`/case/${testConfig.definition.jurisdiction}/${testConfig.definition.caseType}/` + caseId);
    await I.waitForText('Claim created by citizen');
    await I.see('Claim submitted');
    await caseHelper.manageDocumentsEventTriggered(I, 'Correspondence');
}).retry(testConfig.TestRetryScenarios);
