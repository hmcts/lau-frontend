const commonConfig = require('../common/commonConfig');
const testConfig = require('../../../config');

module.exports = async function() {
    const I = this;
    await I.fillField('caseTypeId', 'GrantOfRepresentation');
    await I.fillField('caseJurisdictionId', 'PROBATE');
    await I.fillField('startTimestamp', '2021-08-01 14:42:00');
    await I.fillField('endTimestamp', '2022-02-08 14:42:00');
    await I.click('//button[@name="case-search-btn"]');
    await I.wait(5);
    await I.waitForText('Case Activity Results');
};
