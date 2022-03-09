'use strict';

const bsConfig = require('./bsConfig');
const commonConfig = require('../common/commonConfig');

module.exports = async function () {
    const I = this;
    await I.fillField('#breathingSpace_bsReferenceNumber', bsConfig.page1_BS_referenceNo);
    await I.fillField('#bsEnteredDateByInsolvencyTeam-day', bsConfig.page1_BS_day);
    await I.fillField('#bsEnteredDateByInsolvencyTeam-month', bsConfig.page1_BS_month);
    await I.fillField('#bsEnteredDateByInsolvencyTeam-year', bsConfig.page1_BS_year);
    await I.checkOption('#breathingSpace_bsType-STANDARD_BS_ENTERED');
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
