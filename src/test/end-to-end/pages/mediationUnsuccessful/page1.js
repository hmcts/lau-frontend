'use strict';

const testConfig = require('../../../config');
const mediationConfig = require('./mediationConfig');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitInUrl('FailedMediation1', testConfig.TestTimeToWaitForText);
    await I.waitForElement('#respondents', testConfig.TestTimeToWaitForText);

    await I.runAccessibilityTest();
    await I.fillField('#respondents_0_mediationFailedReason', mediationConfig.page1_mediationFailedReason);
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
