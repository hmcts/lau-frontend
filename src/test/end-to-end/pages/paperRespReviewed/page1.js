'use strict';

const testConfig = require('../../../config');
const paperRespReviewedConfig = require('./paperRespReviewedConfig');
const commonConfig = require('../common/commonConfig');

module.exports = async function (formType = 'OCON9x (Paper response (All))', docSubmissionFieldEnabled = false) {
    const I = this;
    await I.waitInUrl('ReviewedPaperResponse/ReviewedPaperResponse1', testConfig.TestTimeToWaitForText);
    await I.waitForElement('#paperResponseType', testConfig.TestTimeToWaitForText);
    await I.runAccessibilityTest();

    await I.selectOption('#paperResponseType', 'Received via Bulk scan or Email');

    await I.waitForElement('#scannedDocuments', testConfig.TestTimeToWaitForText);
    await I.click(paperRespReviewedConfig.page1_addNewScannedDocsButton);

    await I.waitForElement('#scannedDocuments_0_url', testConfig.TestTimeToWaitForText);
    await I.attachFile(paperRespReviewedConfig.page1_staffUploadDocField, 'fixtures/data/test.pdf');
    await I.waitForElement('#scannedDocuments_0_type', testConfig.TestTimeToWaitForText);
    await I.selectOption('#scannedDocuments_0_type', 'Form');
    await I.waitForElement('#scannedDocuments_0_formSubtype', testConfig.TestTimeToWaitForText);
    await I.selectOption('#scannedDocuments_0_formSubtype', formType);
    if (docSubmissionFieldEnabled) {
        await I.wait(5);
        await I.click(paperRespReviewedConfig.page1_docSubmittedBy);
    }
    await I.wait(5);
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
