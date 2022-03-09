'use strict';

const testConfig = require('../../../config');
const mediationConfig = require('./mediationConfig');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitInUrl('SuccessfulMediation2', testConfig.TestTimeToWaitForText);

    await I.runAccessibilityTest();
    await I.click(mediationConfig.page2_addNewButton);
    await I.waitForElement('#staffUploadedDocuments', testConfig.TestTimeToWaitForText);
    await I.waitForElement('#staffUploadedDocuments_0_0');

    await I.attachFile(mediationConfig.page2_staffUploadDocField, 'fixtures/data/fileupload.txt');
    await I.fillField('#staffUploadedDocuments_0_documentName', mediationConfig.page2_docName);

    await I.fillField('#receivedDatetime-day', mediationConfig.page2_settlementReached_day);
    await I.fillField('#receivedDatetime-month', mediationConfig.page2_settlementReached_month);
    await I.fillField('#receivedDatetime-year', mediationConfig.page2_settlementReached_year);

    await I.fillField('#receivedDatetime-hour', mediationConfig.page2_settlementReached_hour);
    await I.fillField('#receivedDatetime-minute', mediationConfig.page2_settlementReached_minute);
    await I.fillField('#receivedDatetime-second', mediationConfig.page2_settlementReached_second);

    await I.selectOption('#staffUploadedDocuments_0_documentType', mediationConfig.page2_documentType);

    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
