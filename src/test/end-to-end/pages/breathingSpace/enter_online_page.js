'use strict';

const bsConfig = require('./bsConfig');

module.exports = async function () {
    const I = this;
    await I.see(bsConfig.enter_online_page_text1);
    await I.click(bsConfig.enter_online_page_text1);
    await I.fillField('input[id="bsNumber"]', bsConfig.page1_BS_referenceNo);
    await I.click('input[type=submit]');
    await I.fillField('input[id="respiteStart[day]"]', bsConfig.page1_BS_day);
    await I.fillField('input[id="respiteStart[month]"]', bsConfig.page1_BS_month);
    await I.fillField('input[id="respiteStart[year]"]', bsConfig.page1_BS_year);
    await I.click('input[type=submit]');
    await I.checkOption('input[id=optionSTANDARD_BS_ENTERED]');
    await I.click('input[type=submit]');
    await I.click('input[type=submit]');
    await I.click('input[type=submit]');
    await I.see(bsConfig.enter_online_page_text2);
};
