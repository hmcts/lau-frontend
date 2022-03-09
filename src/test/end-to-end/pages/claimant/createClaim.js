const commonConfig = require('../common/commonConfig');

const testConfig = require('../../../config');

module.exports = async function() {
    const I = this;
    await I.amOnCitizenAppPage('testing-support/create-claim-draft');
    await I.waitForText('Create Claim Draft', testConfig.TestTimeToWaitForText);
    await I.waitForNavigationToComplete(commonConfig.createDraftClaim);

    await I.waitInUrl('claim/check-and-send');
    await I.click('#signedtrue');
    await I.waitForNavigationToComplete(commonConfig.submitAndPay);

    await I.waitInUrl('card_details');
    await I.enterPaymentDetails();
    await I.confirmPayment();

    await I.waitInUrl('/confirmation');
    await I.wait(5);
    const claimRef = await I.extractClaimRef();
    return claimRef;
};
