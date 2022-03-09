'use strict';

const testConfig = require('../../../config');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitInUrl('ChangeContactDetails2', testConfig.TestTimeToWaitForText);
    await I.runAccessibilityTest();
    await I.wait(1);
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
