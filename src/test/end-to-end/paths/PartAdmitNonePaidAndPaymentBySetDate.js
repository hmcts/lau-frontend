const testConfig = require('../../config');
const {userType} = require('../common/Constants');
const apiRequest = require('../claimStoreApi/apiRequest.js');
const idamHelper = require('../ccdApi/idamHelper');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

Feature('Part Admission Paid none will pay by set date').retry(testConfig.TestRetryFeatures);

let pinValue;
let claim;

Scenario('Part Admission Paid none will pay by set date', async ({I}) => {
    //claimant steps
    await I.amOnCitizenAppPage('');
    await I.authenticateWithIdam(userType.CITIZEN, true);
    const claimRef = await I.createClaimDefendantAsLimitedCompany();
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
    await I.confirmDefendantDetails('LIMITED COMPANY');
    await I.defendantExtraTimeNeeded('no');

    //Respond to claim
    await I.chooseDefendantResponse('PART_ADMISSION');
    await I.moneyOweAndDisagreement('specificDate');
    await I.shareDefendantFinancialDetails('LIMITED COMPANY');
    await I.selectMediationOptions('yes', 'LIMITED COMPANY');
    await I.hearingDetails('LIMITED COMPANY');

    //Submit
    await I.submitDefendantResponse('PART_ADMISSION', 'LIMITED COMPANY');
    await I.click('Sign out');
    await I.wait(5);

    //Claimant response
    await I.amOnCitizenAppPage('');
    await I.authenticateWithIdam(userType.CITIZEN, true);

    await I.amOnCitizenAppPage(`dashboard/${externalId}/claimant`);
    await I.click('View and respond');

    //How they responded
    await I.viewDefendantResponse('PART_ADMISSION');
    await I.acceptOrRejectResponse('', 'PART_ADMISSION', '', 'no', 'LIMITED COMPANY');
    //await I.signAgreement();

    await I.checkAndSumbitResponse();
    await I.waitInUrl('claimant-response/confirmation');
    await I.see(claimRef);
    await I.see('You’ve proposed a different repayment plan');
    await I.see('You need to send the defendant’s financial details to the court.');
    await I.click('My account');
    await I.see(claimRef);
    await I.see('You need to send the defendant’s financial details to the court.');
}).retry(testConfig.TestRetryScenarios);
