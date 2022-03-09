'use strict';

const caseHelper = require('../ccdApi/caseHelper');
const apiRequest = require('../claimStoreApi/apiRequest.js');
const {userType} = require('../common/Constants');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const featureToggle = new (require('../helpers/featureToggles'))();
const testConfig = require('src/test/config.js');

Feature('OCON9x functionality').retry(testConfig.TestRetryFeatures);

let launchDarklyOCONFlag = false;
Before(async () => {
    launchDarklyOCONFlag = await featureToggle.getToggleValue('oconenhancements');
});

Scenario('Claimant create a case --> Caseworker submit ocon9x event and paper resp admission', async ({I}) => {
    logger.info('The launchDarklyOCONFlag is set to ..', launchDarklyOCONFlag);
    if (launchDarklyOCONFlag === true) {
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
        await I.waitForText('Claim created by citizen');
        await I.see('Claim submitted');
        await I.dontSee('Admitted All');

        //OCON events
        await caseHelper.issuePaperDefenceForms(I);
        await caseHelper.paperResponseReviewed(I, 'OCON9x (Paper response (All))');
        await caseHelper.reviewOcon9xEvent(I);
        await caseHelper.paperRespAdmission(I);
    }
}).retry(testConfig.TestRetryScenarios);

Scenario('Claimant create a case --> Caseworker submit ocon9x event and paper resp defence', async ({I}) => {
    logger.info('The launchDarklyOCONFlag is set to ..', launchDarklyOCONFlag);
    if (launchDarklyOCONFlag === true) {
        //claimant steps
        await I.amOnCitizenAppPage('');
        await I.authenticateWithIdam(userType.CITIZEN, true);
        const claimRef = await I.createClaimDefendantAsOrg();
        await I.click('Sign out');

        const claim = await apiRequest.retrieveByReferenceNumber(claimRef);
        const caseId = claim.ccdCaseId;

        //login as caseworker and verify created event
        await I.authenticateWithIdam(userType.CASEWORKER);
        await I.amOnPage(`/case/${testConfig.definition.jurisdiction}/${testConfig.definition.caseType}/` + caseId);
        await I.waitForText('Claim created by citizen');
        await I.see('Claim submitted');
        await I.dontSee('Admitted All');

        //OCON events
        await caseHelper.issuePaperDefenceForms(I);
        await caseHelper.paperResponseReviewed(I, 'OCON9x (Paper response (All))');
        await caseHelper.reviewOcon9xEvent(I);
        await caseHelper.paperRespDefence(I);
    }
}).retry(testConfig.TestRetryScenarios);

After(() => {
    featureToggle.closeConnection();
});
