const commonConfig = require('../common/commonConfig');
const testConfig = require('../../../config');

module.exports = async function(amount = '500') {
    const I = this;
    await I.amOnCitizenAppPage('testing-support/create-claim-draft');
    await I.waitForText('Create Claim Draft', testConfig.TestTimeToWaitForText);
    await I.waitForNavigationToComplete(commonConfig.createDraftClaim);

    await I.waitInUrl('claim/check-and-send');

    await I.amOnCitizenAppPage('claim/amount');
    await I.fillField('//input[@id="rows[0][amount]"]', amount);
    await I.click('Save and continue');

    await I.waitInUrl('claim/interest');
    await I.click('Save and continue');

    await I.waitInUrl('claim/help-with-fees');
    await I.click('Save and continue');

    await I.waitInUrl('claim/total');
    await I.click('Save and continue');

    await I.waitInUrl('claim/task-list');
    await I.click('Check and submit your claim');
    await I.waitInUrl('claim/check-and-send');

    await I.click('#signedtrue');
    await I.waitForNavigationToComplete(commonConfig.submitAndPay);

    await I.waitInUrl('card_details');
    await I.enterPaymentDetails();
    await I.confirmPayment();

    await I.waitInUrl('/confirmation');
    const claimRef = await I.extractClaimRef();
    return claimRef;
};
