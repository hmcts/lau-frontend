'use strict';

const caseHelper = require('../ccdApi/caseHelper');
const apiRequest = require('../claimStoreApi/apiRequest.js');
const {userType} = require('../common/Constants');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const featureToggle = new (require('../helpers/featureToggles'))();
const testConfig = require('src/test/config.js');

Feature('Breathing Space functionality').retry(testConfig.TestRetryFeatures);

let launchDarklyBSFlag = false;
Before(async () => {
    launchDarklyBSFlag = await featureToggle.getToggleValue('breathingSpace');
});

Scenario('End to end:claimant Entering Breathing Space via Online and ccd staff Lifting BS via CCD', async ({I}) => {
    logger.info('The launchDarklyBreathingSpace flag is ', launchDarklyBSFlag);
    if (launchDarklyBSFlag === true) {
        //claimant steps
        await I.amOnCitizenAppPage('');
        await I.authenticateWithIdam(userType.CITIZEN, true);
        const claimRef = await I.createClaimDefendantAsOrg();
        logger.info({message: 'Created a claim in ccd with claim ref: ', claimRef});
        await I.click('My account');
        await I.see('Your money claims account');
        await I.click(claimRef);
        await I.see('Claim number:');
        await caseHelper.enterBreathingSpaceOnline(I);
        await I.click('Sign out');
        const claim = await apiRequest.retrieveByReferenceNumber(claimRef);
        const caseId = claim.ccdCaseId;

        //login as caseworker and verify created event
        await I.authenticateWithIdam(userType.CASEWORKER);
        await I.amOnPage(`/case/${testConfig.definition.jurisdiction}/${testConfig.definition.caseType}/` + caseId);
        await I.see('Claim submitted');
        await I.see('Enter Breathing Space');
        await caseHelper.liftBreathingSpace(I);
        await I.see('Lift Breathing Space');
    }
}).retry(testConfig.TestRetryScenarios);

Scenario('Enter and Lift Breathing Space Via CCD', async ({I}) => {
    logger.info('The launchDarklyBreathingSpace flag is ', launchDarklyBSFlag);
    if (launchDarklyBSFlag === true) {
        //claimant steps
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
        await I.see('Claim created by citizen');

        //BreathingSpace events
        await caseHelper.enterBreathingSpace(I);
        await caseHelper.liftBreathingSpace(I);

    }
}).retry(testConfig.TestRetryScenarios);

Scenario('Negative: Caseworker cannot Enter Breathing Space When Case handed to CCBC', async ({I}) => {
    logger.info('The launchDarklyBreathingSpace flag is ', launchDarklyBSFlag);
    if (launchDarklyBSFlag === true) {
        //claimant steps
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
        await I.see('Claim created by citizen');
        await I.see('Claim submitted');
        //Case handed to CCBC
        await caseHelper.handedToCCBC(I);
        //BreathingSpace even
        await caseHelper.enterBreathingSpaceError(I);
    }
}).retry(testConfig.TestRetryScenarios);

After(() => {
    featureToggle.closeConnection();
});
