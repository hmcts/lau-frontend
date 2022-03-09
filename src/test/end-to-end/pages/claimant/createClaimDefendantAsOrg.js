const commonConfig = require('../common/commonConfig');
const testConfig = require('../../../config');

module.exports = async function() {
    const I = this;
    await I.amOnCitizenAppPage('testing-support/create-claim-draft');
    await I.waitForText('Create Claim Draft', testConfig.TestTimeToWaitForText);
    await I.waitForNavigationToComplete(commonConfig.createDraftClaim);

    await I.waitInUrl('claim/check-and-send');

    await I.amOnCitizenAppPage('claim/defendant-party-type-selection');
    await I.click('//input[@id="typeorganisation"]');
    await I.click('Save and continue');

    await I.amOnCitizenAppPage('claim/defendant-organisation-details');
    await I.fillField('#name', 'Org name');
    await I.fillField('//input[@id="address[postcodeLookup]"]', 'SL6 2PU');
    await I.click('Find address');
    await I.wait(2);
    await I.waitForElement('//select[@id="address[addressList]"]');
    await I.selectOption('//select[@id="address[addressList]"]', '6, COURTLANDS, MAIDENHEAD, SL6 2PU');
    await I.wait(2);
    await I.click('Save and continue');

    await I.waitInUrl('claim/defendant-email');
    await I.click('Save and continue');
    await I.waitInUrl('claim/defendant-mobile');
    await I.click('Save and continue');
    await I.waitInUrl('claim/task-list');
    await I.click('Check and submit your claim');
    await I.waitInUrl('claim/check-and-send');

    await I.click('#signedtrue');
    await I.waitForNavigationToComplete(commonConfig.submitAndPay);

    await I.wait(5);
    await I.waitInUrl('card_details');
    await I.enterPaymentDetails();
    await I.wait(5);
    await I.confirmPayment();

    await I.waitInUrl('/confirmation');
    const claimRef = await I.extractClaimRef();
    return claimRef;
};
