'use strict';

const testConfig = require('../../../config');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitInUrl('PaperResponseFullDefence/PaperResponseFullDefence1', testConfig.TestTimeToWaitForText);
    await I.waitForElement('#defenceType-DISPUTE');

    await I.runAccessibilityTest();

    await I.click('#defenceType-DISPUTE');

    await I.click('#respondents_0_responseFreeMediationOption_Yes');

    await I.wait(2);
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
