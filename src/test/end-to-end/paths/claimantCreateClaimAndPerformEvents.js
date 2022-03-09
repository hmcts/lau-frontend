'use strict';

const testConfig = require('../../config');
const caseHelper = require('../ccdApi/caseHelper');
const apiRequest = require('../claimStoreApi/apiRequest.js');
const {userType} = require('../common/Constants');

Feature('Create claim flow)');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

Scenario('Create Claimant flow then events claim notes, change contact details, resend rpa, reset pin, link letter holder id, attach via bulk scan, support updatee, transfer casee', async ({I}) => {
    //claimant steps
    await I.amOnCitizenAppPage('');
    await I.authenticateWithIdam(userType.CITIZEN, true);
    const claimRef = await I.createClaim();
    logger.info({message: 'Claimant has created a claim with reference..', claimRef});
    await I.click('Sign out');

    const claim = await apiRequest.retrieveByReferenceNumber(claimRef);
    const caseId = claim.ccdCaseId;

    logger.info({message: 'Case number is ', caseId});

    //login as caseworker and verify created event
    await I.authenticateWithIdam(userType.CASEWORKER);
    await I.amOnPage(`/case/${testConfig.definition.jurisdiction}/${testConfig.definition.caseType}/` + caseId);
    await I.waitForText('Claim created by citizen');
    await caseHelper.addClaimNotets(I);
    await caseHelper.changeContactDetails(I, 'Defendant');
    await caseHelper.changeContactDetails(I, 'Claimant');
    await caseHelper.resendRPA(I);
    await caseHelper.resetPin(I);
    await caseHelper.moveClaimToWaitngToBeTransferred(I);
    await caseHelper.linkLetterHolderId(I);
    await caseHelper.attachViaBulkScan(I);
    await caseHelper.supportUpdateEvent(I);
    await caseHelper.transferCase(I);
}).retry(testConfig.TestRetryScenarios);
