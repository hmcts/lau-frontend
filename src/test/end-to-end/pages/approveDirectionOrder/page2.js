'use strict';

const testConfig = require('../../../config');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitForText('Approved', testConfig.TestTimeToWaitForText);
    await I.runAccessibilityTest();
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
