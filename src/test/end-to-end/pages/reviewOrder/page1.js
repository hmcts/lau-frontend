'use strict';

const testConfig = require('../../../config');
const reviewOrderConfig = require('./reviewOrderConfig');
const commonConfig = require('../common/commonConfig');

module.exports = async function (claimNumber) {
    const I = this;
    if (testConfig.TestForCrossBrowser) {
        await I.wait(5);
    }
    await I.waitInUrl('ReviewOrder1', testConfig.TestTimeToWaitForText);
    await I.runAccessibilityTest();
    const linkXPath = `//a[contains(text(), '${claimNumber}-Legal-Adviser-Directions-Order.pdf')]`;
    await I.waitForClickable(linkXPath, testConfig.TestTimeToWaitForText);
    await I.selectOption('#assignedTo', reviewOrderConfig.page1_assignedTo);
    //await I.click(claimNumber + '-Legal-Adviser-Directions-Order.pdf');
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
