const config = require('../../config.js');
const apiRequest = require('./apiRequest.js');
const initiateClaimPaymentCitizenJson = require('../fixtures/data/InitiateClaimPaymentCitizen');
const {v4: uuidv4} = require('uuid');

const {userType, caseEventId, caseEventName} = require('../common/Constants');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

async function initateCaseByCitizen() {
    initiateClaimPaymentCitizenJson.externalId = uuidv4();
    return await updateApiEvent(caseEventId.INITIATE_PAYMENT_CASE, initiateClaimPaymentCitizenJson);
}

async function updateApiEvent(eventName, json, caseId) {
    await apiRequest.startEvent(eventName, caseId);
    return await apiRequest.submitEvent(eventName, json, caseId);
}

async function updateCaseworkerEvent(I, eventName, caseId) {
    await I.authenticateWithIdam(userType.CASEWORKER);
    await I.amOnPage(`/case/${config.definition.jurisdiction}/${config.definition.caseType}/` + caseId);
    await I.chooseNextStep(eventName);
    await I.enterEventSummary(eventName);
}

async function updateJudgeEvent(I, eventName, caseId) {
    await I.authenticateWithIdam(userType.JUDGE);
    await I.amOnPage(`/case/${config.definition.jurisdiction}/${config.definition.caseType}/` + caseId);
    await I.chooseNextStep(eventName);
    await I.enterEventSummary(eventName);
}

async function updateLAEvent(I, eventName, caseData, caseId) {
    await I.authenticateWithIdam(userType.LA);
    await I.amOnPage(`/case/${config.definition.jurisdiction}/${config.definition.caseType}/` + caseId);
    await I.chooseNextStep(eventName);
    await I.enterGenerateOrderPage1();
    await I.enterGenerateOrderPage2(caseData.previousServiceCaseReference);
    await I.enterEventSummary(eventName);
}

async function reviewOrder(I, eventName, caseData, caseId) {
    await I.authenticateWithIdam(userType.JUDGE);
    await I.amOnPage(`/case/${config.definition.jurisdiction}/${config.definition.caseType}/` + caseId);
    await I.chooseNextStep(eventName);
    await I.enterReviewOrderPage1(caseData.previousServiceCaseReference);
    await I.enterEventSummary(eventName);
}

async function actionReviewComments(I, eventName, caseData, caseId) {
    await I.authenticateWithIdam(userType.LA);
    await I.amOnPage(`/case/${config.definition.jurisdiction}/${config.definition.caseType}/` + caseId);
    await I.chooseNextStep(eventName);
    await I.enterActionReviewCommentsPage1();
    await I.enterActionReviewCommentsPage2(caseData.previousServiceCaseReference);
    await I.enterEventSummary(eventName);
}

async function approveDirectionOrder(I, caseData, caseId) {
    const eventName = caseEventName.APPROVE_DIRECTIONS_ORDER;
    await I.authenticateWithIdam(userType.JUDGE);
    await I.amOnPage(`/case/${config.definition.jurisdiction}/${config.definition.caseType}/` + caseId);
    await I.chooseNextStep(eventName);
    await I.enterApproveDirectionOrderPage1(caseData.previousServiceCaseReference);
    await I.enterApproveDirectionOrderPage2();
}

async function drawDirectionOrder(I, caseData, caseId) {
    const eventName = caseEventName.DRAW_DIRECTIONS_ORDER;
    await I.authenticateWithIdam(userType.LA);
    await I.amOnPage(`/case/${config.definition.jurisdiction}/${config.definition.caseType}/` + caseId);
    await I.chooseNextStep(eventName);
    await I.enterDrawDirectionsOrderPage1(caseData.previousServiceCaseReference);
    await I.enterEventSummary(eventName);
}

async function JudgeDrawDirectionOrder(I, caseData, caseId) {
    const eventName = caseEventName.JUDGE_DRAW_DIRECTIONS_ORDER;
    await I.authenticateWithIdam(userType.JUDGE);
    await I.amOnPage(`/case/${config.definition.jurisdiction}/${config.definition.caseType}/` + caseId);
    await I.chooseNextStep(eventName);
    //Need to reload the page as xui is not loading the page properly
    await I.amOnPage('/cases/case-details/' + caseId + '/trigger/DrawJudgesOrder/DrawJudgesOrder1');
    await I.enterJudgeDrawDirectionsOrderPage1();
    await I.enterJudgeDrawDirectionsOrderPage2();
    await I.enterJudgeDrawDirectionsOrderPage3(caseData.previousServiceCaseReference);
}

async function updateMediationSuccessful(I) {
    logger.info({message: 'Inside updateMediationSuccessful'});
    const eventName = caseEventName.MEDIATION_SUCCESSFUL;
    await I.chooseNextStep(eventName);
    await I.enterMediationSuccessPage1();
    await I.enterMediationSuccessPage2();
    logger.info({message: 'After enterMediationSuccessPage2'});
    await I.enterEventSummary(eventName);
    logger.info({message: 'Exiting updateMediationSuccessful'});
}

async function updateMediationUnsuccessful(I) {
    const eventName = caseEventName.MEDIATION_FAILED;
    await I.chooseNextStep(eventName);
    await I.enterMediationFailurePage1();
    await I.enterEventSummary(eventName);
}

async function issuePaperDefenceForms(I) {
    const eventName = caseEventName.ISSUE_PAPER_DEFENCE_FORMS;
    await I.chooseNextStep(eventName);
    await I.enterEventSummary(eventName);
}

async function paperResponseReviewed(I, formType = 'OCON9x (Paper response (All))', docSubmissionFieldEnabled = false) {
    const eventName = caseEventName.PAPER_RESP_REVIEWED;
    await I.chooseNextStep(eventName);
    await I.enterPaperRespReviewPage1(formType, docSubmissionFieldEnabled);
    await I.enterPaperRespReviewPage2();
    await I.enterEventSummary(eventName);
}

async function reviewOcon9xEvent(I) {
    const eventName = caseEventName.REVIEW_OCON9X_RESP;
    await I.chooseNextStep(eventName);
    await I.enterReviewOcon9xPage1();
    await I.enterEventSummary(eventName);
}

async function paperRespAdmission(I) {
    const eventName = caseEventName.PAPER_RESP_ADMISSIOON;
    await I.chooseNextStep(eventName);
    await I.enterPaperRespAdmissionPage1();
    await I.enterEventSummary(eventName);
}

async function paperRespDefence(I) {
    const eventName = caseEventName.PAPER_RESP_DEFENCE;
    await I.chooseNextStep(eventName);
    await I.enterPaperRespDefencePage1();
    await I.enterEventSummary(eventName);
}

async function setUpApiAuthToken(user) {
    await apiRequest.setupTokens(user);
}

function getNextClaimNumber() {
    return '00' + Math.random().toString(36)
        .slice(-6);
}

async function signOut(I) {
    await I.click('Sign out');
    await I.waitForElement('#username');
}

async function createOpenCase(I, createCitizenCaseJson) {
    const initiatedClaim = await initateCaseByCitizen();
    const caseDetails = await initiatedClaim.json();
    createCitizenCaseJson.id = caseDetails.id;
    createCitizenCaseJson.previousServiceCaseReference = getNextClaimNumber();

    await updateApiEvent(caseEventId.STAY_CLAIM, createCitizenCaseJson, createCitizenCaseJson.id);
    await updateApiEvent(caseEventId.LIFT_STAY, createCitizenCaseJson, createCitizenCaseJson.id);
    return createCitizenCaseJson;
}

async function enterBreathingSpace(I) {
    const eventName = caseEventName.ENTER_BREATHING_SPACE;
    await I.chooseNextStep(eventName);
    await I.enterBreathingSpacePage1();
    await I.enterBreathingSpacePage2();
    await I.enterEventSummary(eventName);
}

async function liftBreathingSpace(I) {
    const eventName = caseEventName.LIFT_BREATHING_SPACE;
    await I.chooseNextStep(eventName);
    await I.liftBreathingSpacePage1();
    await I.liftBreathingSpacePage2();
    await I.enterEventSummary(eventName);
}

async function handedToCCBC(I) {
    const eventName = caseEventName.CASE_HANDED_TO_CCBC;
    await I.chooseNextStep(eventName);
    await I.enterEventSummary(eventName);
}

async function enterBreathingSpaceOnline(I) {
    await I.enterBreathingSpaceOnlinePage();
}

async function enterBreathingSpaceError(I) {
    const eventName = caseEventName.ENTER_BREATHING_SPACE;
    await I.chooseNextStep(eventName);
    await I.see('Unable to proceed because there are one or more callback Errors or Warnings');
    await I.see('This Event cannot be triggered since the claim is no longer part of the online civil money claims journey');
}

async function changeContactDetails(I, userType = '') {
    const eventName = caseEventName.CHANGE_CONTACT_DETAILS;
    await I.chooseNextStep(eventName);
    await I.changeContactDetailsPage1(userType);
    await I.changeContactDetailsPage2();
    await I.enterEventSummary(eventName);
}

async function resetPin(I) {
    const eventName = caseEventName.RESET_PIN;
    await I.chooseNextStep(eventName);
    await I.enterEventSummary(eventName);
}

async function resendRPA(I) {
    const eventName = caseEventName.RESEND_RPA;
    await I.chooseNextStep(eventName);
    await I.waitForElement('#RPAEventType');
    await I.selectOption('#RPAEventType', 'Claim');
    await I.click('Continue');
    await I.enterEventSummary(eventName);
}

async function attachViaBulkScan(I) {
    const eventName = caseEventName.ATTACH_VIA_BULK_SCAN;
    await I.chooseNextStep(eventName);
    await I.enterEventSummary(eventName);
}

async function addClaimNotets(I) {
    const eventName = caseEventName.CLAIM_NOTES;
    await I.chooseNextStep(eventName);
    await I.enterEventSummary(eventName);
}

async function linkLetterHolderId(I) {
    const eventName = caseEventName.LINK_LETTER_HOLDER_ID;
    await I.chooseNextStep(eventName);
    await I.enterEventSummary(eventName);
}

async function moveClaimToWaitngToBeTransferred(I) {
    const eventName = caseEventName.WAITING_TO_BE_TRANSFERRED;
    await I.chooseNextStep(eventName);
    await I.enterEventSummary(eventName);
}

async function supportUpdateEvent(I) {
    const eventName = caseEventName.SUPPORT_UPDATE;
    await I.chooseNextStep(eventName);
    await I.enterEventSummary(eventName);
}

async function transferCase(I) {
    const eventName = caseEventName.TRANSFER_CASE;
    await I.chooseNextStep(eventName);
    await I.waitForElement('#transferContent_transferCourtName');
    await I.fillField('#transferContent_transferCourtName', 'Slough court');
    await I.fillField('#transferContent_transferCourtAddress_transferCourtAddress_postcodeInput', 'SL11GF');
    await I.click('Find address');
    await I.wait(5);
    await I.retry(10).selectOption('#transferContent_transferCourtAddress_transferCourtAddress_addressList', ' Flat 1, Skyline 292-298, High Street, Slough ');
    await I.click('#transferContent_transferReason-ENFORCEMENT');
    await I.click('Continue');
}

async function updatedHWFNumber (I, hwfRefNum) {
    const eventName = caseEventName.UPDATED_HWF_NUM;
    await I.chooseNextStep(eventName);
    await I.waitInUrl('UpdateHWFNumber/UpdateHWFNumber1');
    await I.fillField('#helpWithFeesNumber', hwfRefNum);
    await I.click('Continue');
    await I.enterEventSummary(eventName);
}

async function invalidHWFNumber(I) {
    const eventName = caseEventName.INVALID_HWF_REF;
    await I.chooseNextStep(eventName);
    await I.waitInUrl('InvalidHWFReference/InvalidHWFReference1');
    await I.click('Continue');
    await I.enterEventSummary(eventName);
}

async function noRemissionHwf(I) {
    const eventName = caseEventName.NO_REMISSION_HWF;
    await I.chooseNextStep(eventName);
    await I.waitInUrl('NoRemissionHWF/NoRemissionHWF1');
    await I.selectOption('#hwfFeeDetailsSummary', 'Does not qualify for Help with Fees assistance');
    await I.fillField('#hwfMandatoryDetails', 'Remission cannot be provided');
    await I.click('Continue');
    await I.enterEventSummary(eventName);
}

async function manageDocumentsEventTriggered(I, formType = 'Other', docSubmissionFieldEnabled = false) {
    const eventName = caseEventName.MANAGE_DOCUMENTS;
    await I.chooseNextStep(eventName);
    await I.enterManageDocumentsEventTriggered(formType, docSubmissionFieldEnabled);
    await I.enterEventSummary(eventName);
}

module.exports = {
    initateCaseByCitizen,
    createOpenCase,
    updateApiEvent,
    updateCaseworkerEvent,
    updateJudgeEvent,
    updateLAEvent,
    getNextClaimNumber,
    setUpApiAuthToken,
    reviewOrder,
    actionReviewComments,
    approveDirectionOrder,
    drawDirectionOrder,
    JudgeDrawDirectionOrder,
    updateMediationSuccessful,
    updateMediationUnsuccessful,
    issuePaperDefenceForms,
    paperResponseReviewed,
    manageDocumentsEventTriggered,
    reviewOcon9xEvent,
    paperRespAdmission,
    paperRespDefence,
    enterBreathingSpace,
    liftBreathingSpace,
    handedToCCBC,
    enterBreathingSpaceOnline,
    enterBreathingSpaceError,
    addClaimNotets,
    resendRPA,
    attachViaBulkScan,
    resetPin,
    moveClaimToWaitngToBeTransferred,
    linkLetterHolderId,
    supportUpdateEvent,
    changeContactDetails,
    transferCase,
    updatedHWFNumber,
    invalidHWFNumber,
    noRemissionHwf,
    signOut
};
