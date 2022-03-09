const testConfig = require('../../config');
const {userType} = require('../common/Constants');
const apiRequest = require('../claimStoreApi/apiRequest.js');
const idamHelper = require('../ccdApi/idamHelper');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

Feature('Part Admission - CCJ').retry(testConfig.TestRetryFeatures);

let pinValue;
let claim;

Scenario('Full Admit SoleTrader Vs Org', async ({I}) => {
    //claimant steps
    await I.amOnCitizenAppPage('');
    await I.authenticateWithIdam(userType.CITIZEN, true);
    const claimRef = await I.createClaimantAsSoleTraderDefendantAsOrg();
    await I.click('Sign out');

    claim = await apiRequest.retrieveByReferenceNumber(claimRef);
    const caseId = claim.ccdCaseId;
    const externalId = claim.externalId;

    logger.info({message: 'Claimant created a case with id: ', caseId});

    if (typeof claim.letterHolderId === 'undefined') {
        await I.wait(5);
        claim = await apiRequest.retrieveByReferenceNumber(claimRef);
    }

    pinValue = await idamHelper.getPin(claim.letterHolderId);

    await I.linkDefendant(claimRef, pinValue);

    //Defendant steps

    await I.waitInUrl('first-contact/claim-summary');
    await I.click('Respond to claim');

    await I.wait(10);
    await I.click('Sign in to your account.');
    await I.wait(5);
    await I.authenticateWithIdam(userType.CITIZEN, true);

    await I.waitInUrl('/dashboard');
    await I.see(claimRef);
    await I.amOnCitizenAppPage(`dashboard/${externalId}/defendant`);
    await I.click('Respond to claim');

    //Prepare your response
    await I.confirmDefendantDetails('ORG');
    await I.defendantExtraTimeNeeded('no');

    //Respond to claim
    await I.chooseDefendantResponse('FULL_ADMISSION');
    await I.decideHowToPay('specificDate');
    await I.shareDefendantFinancialDetails('ORG');
    //Submit
    await I.submitDefendantResponse('FULL_ADMISSION', 'ORG');
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
}).retry(testConfig.TestRetryScenarios);
