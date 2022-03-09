'use strict';

const testConfig = require('../../../config');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitInUrl('ReviewedPaperResponse/ReviewedPaperResponse2', testConfig.TestTimeToWaitForText);
    await I.wait(5);
    await I.runAccessibilityTest();
    await I.click('#evidenceHandled_No');
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
