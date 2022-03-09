'use strict';

const caseHelper = require('../ccdApi/caseHelper');
const apiRequest = require('../claimStoreApi/apiRequest.js');
const {userType} = require('../common/Constants');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const testConfig = require('src/test/config.js');

Feature('Paper response reviewed upload functionality').retry(testConfig.TestRetryFeatures);

Scenario('Claimant create a case --> Caseworker submit N9 (Request more time)', async ({I}) => {
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
    await caseHelper.paperResponseReviewed(I, 'N9 (Request more time)');
}).retry(testConfig.TestRetryScenarios);

Scenario('Claimant create a case --> Caseworker submit N9a (Paper Admission - Full or Part)', async ({I}) => {
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
    await caseHelper.paperResponseReviewed(I, 'N9a (Paper Admission - Full or Part)');
}).retry(testConfig.TestRetryScenarios);

Scenario('Claimant create a case --> Caseworker submit N9b (Paper Defence/Counterclaim)', async ({I}) => {
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
    await caseHelper.paperResponseReviewed(I, 'N9b (Paper Defence/Counterclaim)');
}).retry(testConfig.TestRetryScenarios);

Scenario('Claimant create a case --> Caseworker submit N11 (Paper Dispute all)', async ({I}) => {
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
    await caseHelper.paperResponseReviewed(I, 'N11 (Paper Dispute all)');
}).retry(testConfig.TestRetryScenarios);

Scenario('Claimant create a case --> Caseworker submit N180 (Paper DQ)', async ({I}) => {
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
    await caseHelper.paperResponseReviewed(I, 'N180 (Paper DQ)', true);
}).retry(testConfig.TestRetryScenarios);

Scenario('Claimant create a case --> Caseworker submit N225 (CCJ request)', async ({I}) => {
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
    await caseHelper.paperResponseReviewed(I, 'N225 (CCJ request)');
}).retry(testConfig.TestRetryScenarios);

Scenario('Claimant create a case --> Caseworker submit N244 (General application)', async ({I}) => {
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
    await caseHelper.paperResponseReviewed(I, 'N244 (General application)', true);
}).retry(testConfig.TestRetryScenarios);

Scenario('Claimant create a case --> Caseworker submit N245 (Application to vary)', async ({I}) => {
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
    await caseHelper.paperResponseReviewed(I, 'N245 (Application to vary)', true);
}).retry(testConfig.TestRetryScenarios);

Scenario('Claimant create a case --> Caseworker submit EX160 (Help with court fees)', async ({I}) => {
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
    await caseHelper.paperResponseReviewed(I, 'EX160 (Help with court fees)', true);
}).retry(testConfig.TestRetryScenarios);

Scenario('Claimant create a case --> Caseworker submit Non prescribed documents', async ({I}) => {
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
    await caseHelper.paperResponseReviewed(I, 'Non prescribed documents', true);
}).retry(testConfig.TestRetryScenarios);
