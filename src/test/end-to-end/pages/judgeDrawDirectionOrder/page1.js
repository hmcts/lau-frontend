'use strict';

const testConfig = require('../../../config');
const judgeDrawDirectionOrderConfig = require('./judgeDrawDirectionOrderConfig');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitForElement('#directionOrderType', testConfig.TestTimeToWaitForText);
    await I.runAccessibilityTest();
    await I.click(`#directionOrderType-${judgeDrawDirectionOrderConfig.page1_directionOrderType}`);
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
