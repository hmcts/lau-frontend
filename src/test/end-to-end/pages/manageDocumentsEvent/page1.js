'use strict';

const testConfig = require('../../../config');
const manageDocumentsConfig = require('./manageDocumentsConfig');
const commonConfig = require('../common/commonConfig');

module.exports = async function (formType = 'Other') {
    const I = this;
    await I.waitInUrl('ManageDocuments/ManageDocuments1', testConfig.TestTimeToWaitForText);
    await I.waitForElement('#staffUploadedDocuments', testConfig.TestTimeToWaitForText);
    await I.click(manageDocumentsConfig.page1_addNewScannedDocsButton);

    await I.waitForElement('#staffUploadedDocuments_0_documentName', testConfig.TestTimeToWaitForText);
    await I.fillField('#staffUploadedDocuments_0_documentName', formType);
    await I.selectOption('#staffUploadedDocuments_0_documentType', formType);
    await I.attachFile(manageDocumentsConfig.page1_staffUploadDocField, 'fixtures/data/test.pdf');
    await I.wait(5);
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
