'use strict';

const testConfig = require('../../../config');
const mediationConfig = require('./mediationConfig');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.waitInUrl('SuccessfulMediation1', testConfig.TestTimeToWaitForText);
    await I.waitForElement('#respondents', testConfig.TestTimeToWaitForText);

    await I.runAccessibilityTest();
    await I.fillField('#mediationSettlementReachedAt-day', mediationConfig.page1_settlementReached_day);
    await I.fillField('#mediationSettlementReachedAt-month', mediationConfig.page1_settlementReached_month);
    await I.fillField('#mediationSettlementReachedAt-year', mediationConfig.page1_settlementReached_year);

    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
