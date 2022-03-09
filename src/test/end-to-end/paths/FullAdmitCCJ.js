const testConfig = require('../../config');
const {userType} = require('../common/Constants');
const apiRequest = require('../claimStoreApi/apiRequest.js');
const idamHelper = require('../ccdApi/idamHelper');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

Feature('Full Admit - Create CCJ flow').retry(testConfig.TestRetryFeatures);

let pinValue;
let claim;

Scenario('Full Admission', async ({I}) => {

    //claimant steps
    await I.amOnCitizenAppPage('');
    await I.authenticateWithIdam(userType.CITIZEN, true);
    const claimRef = await I.createClaim();
    await I.click('Sign out');

    claim = await apiRequest.retrieveByReferenceNumber(claimRef);
    const caseId = claim.ccdCaseId;
    const externalId = claim.externalId;

    logger.info({message: 'Claimant created a case with id: ', caseId});

    //login as caseworker and verify created event
    await I.authenticateWithIdam(userType.CASEWORKER);
    await I.amOnPage(`/case/${testConfig.definition.jurisdiction}/${testConfig.definition.caseType}/` + caseId);
    await I.waitForText('Claim created by citizen');
    await I.see('Claim submitted');
    await I.dontSee('Admitted All');
    await I.click('Sign out');

    if (typeof claim.letterHolderId === 'undefined') {
        await I.wait(5);
        claim = await apiRequest.retrieveByReferenceNumber(claimRef);
    }

    pinValue = await idamHelper.getPin(claim.letterHolderId);

    await I.linkDefendant(claimRef, pinValue);

    //Defendant steps

    await I.waitInUrl('first-contact/claim-summary');
    await I.click('Respond to claim');

    await I.click('Sign in to your account.');
    await I.authenticateWithIdam(userType.CITIZEN, true);

    await I.waitInUrl('/dashboard');
    await I.see(claimRef);
    await I.amOnCitizenAppPage(`dashboard/${externalId}/defendant`);
    await I.click('Respond to claim');

    //Prepare your response
    await I.confirmDefendantDetails();
    await I.defendantExtraTimeNeeded('no');

    //Respond to claim
    await I.chooseDefendantResponse('FULL_ADMISSION');
    await I.decideHowToPay('specificDate');
    await I.shareDefendantFinancialDetails();

    //Submit
    await I.submitDefendantResponse();
    await I.click('Sign out');
    await I.wait(5);

    //login as caseworker and verify created event
    await I.authenticateWithIdam(userType.CASEWORKER);
    await I.amOnPage(`/case/${testConfig.definition.jurisdiction}/${testConfig.definition.caseType}/` + caseId);
    await I.waitForText('Admitted All');
    await I.click('Sign out');
    await I.wait(5);

    //Claimant response
    await I.amOnCitizenAppPage('');
    await I.authenticateWithIdam(userType.CITIZEN, true);

    await I.amOnCitizenAppPage(`dashboard/${externalId}/claimant`);
    await I.click('View and respond to the offer');

    //How they responded
    await I.viewDefendantResponse();
    await I.acceptOrRejectResponse();
    await I.requestCCJ();

    await I.checkAndSumbitResponse();
    await I.waitInUrl('claimant-response/confirmation');

    //login as caseworker and verify created event
    await I.authenticateWithIdam(userType.CASEWORKER);
    await I.amOnPage(`/case/${testConfig.definition.jurisdiction}/${testConfig.definition.caseType}/` + caseId);
    await I.waitForText('Claimant accepted');
    await I.see('CCJ requested');
    await I.see('CCJ upload');
    await I.click('Sign out');

}).retry(testConfig.TestRetryScenarios);
