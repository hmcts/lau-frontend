'use strict';

const testConfig = require('../../../config');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitInUrl('PaperResponseAdmission/PaperResponseAdmission1', testConfig.TestTimeToWaitForText);
    await I.waitForElement('#paperAdmissionType-FULL_ADMISSION');

    await I.runAccessibilityTest();

    await I.click('#paperAdmissionType-FULL_ADMISSION');

    await I.wait(2);
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
