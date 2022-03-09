'use strict';

const testConfig = require('../../../config');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitInUrl('DrawJudgesOrder4', testConfig.TestTimeToWaitForText);
    await I.runAccessibilityTest();
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
