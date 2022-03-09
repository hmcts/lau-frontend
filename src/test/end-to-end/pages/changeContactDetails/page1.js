'use strict';

const testConfig = require('../../../config');
const changeContactDetailsConfig = require('./changeContactDetailsConfig');
const commonConfig = require('../common/commonConfig');

module.exports = async function(userType = '') {
    const I = this;

    await I.waitForElement('#contactChangeParty', testConfig.TestTimeToWaitForText);

    await I.runAccessibilityTest();
    if (userType === 'Defendant') {
        await I.click('#contactChangeParty-DEFENDANT');
        await I.fillField('#respondents_0_partyDetail_emailAddress', changeContactDetailsConfig.page1_email);
        await I.wait(2);
        await I.click('I can\'t enter a UK postcode');
        await I.fillField('#respondents_0_partyDetail_primaryAddress__detailAddressLine1', changeContactDetailsConfig.page1_address);
        await I.fillField('#respondents_0_partyDetail_primaryAddress__detailPostCode', changeContactDetailsConfig.page1_postcode);
    } else {
        await I.click('#contactChangeParty-CLAIMANT');
        await I.fillField('#applicants_0_partyDetail_emailAddress', changeContactDetailsConfig.page1_email);
    }
    await I.wait(5);
    await I.waitForNavigationToComplete(commonConfig.continueButton);
};
