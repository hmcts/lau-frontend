const testConfig = require('../../../config');

async function fillClaimDetails(hwfReference = '') {
    const I = this;
    await I.click('Resolving this dispute');
    await I.waitInUrl('claim/resolving-this-dispute');
    await I.click('input[type=submit]');
    await I.waitInUrl('claim/task-list');

    await I.click('Completing your claim');
    await I.waitInUrl('claim/completing-claim');
    await I.click('input[type=submit]');
    await I.waitInUrl('claim/task-list');

    await I.click('Your details');
    await I.waitInUrl('claim/claimant-party-type-selection');
    await I.click('//input[@id="typeindividual"]');
    await I.click('Save and continue');

    await I.waitInUrl('claim/claimant-individual-details');
    await I.fillField('#title', 'Mrs');
    await I.fillField('#firstName', 'invidual');
    await I.fillField('#lastName', 'claimant');
    await I.fillField('//input[@id="address[postcodeLookup]"]', 'SL6 2PU');
    await I.click('Find address');
    await I.wait(2);
    await I.waitForElement('//select[@id="address[addressList]"]');
    await I.selectOption('//select[@id="address[addressList]"]', '6, COURTLANDS, MAIDENHEAD, SL6 2PU');
    await I.wait(2);
    await I.click('Save and continue');

    await I.waitInUrl('claim/claimant-dob');

    await I.fillField('//input[@id="date[day]"]', 2);
    await I.fillField('//input[@id="date[month]"]', 9);
    await I.fillField('//input[@id="date[year]"]', 1990);
    await I.click('Save and continue');

    await I.waitInUrl('claim/claimant-phone');
    await I.click('Save and continue');
    await I.waitInUrl('claim/task-list');
    await I.click('Their details');

    await I.waitInUrl('claim/defendant-party-type-selection');
    await I.click('//input[@id="typeindividual"]');
    await I.click('Save and continue');

    await I.waitInUrl('claim/defendant-individual-details');
    await I.fillField('#title', 'Mr');
    await I.fillField('#firstName', 'deffirstname');
    await I.fillField('#lastName', 'deflastname');
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

    await I.click('Claim amount');
    await I.waitInUrl('claim/amount');
    await I.fillField('//input[@id="rows[0][reason]"]', 'Broken door');
    await I.fillField('//input[@id="rows[0][amount]"]', 100);
    await I.click('Save and continue');
    await I.waitInUrl('claim/interest');
    await I.click('#optionno');
    await I.click('Save and continue');

    await I.waitInUrl('claim/help-with-fees');
    if (hwfReference === '') {
        await I.click('#declaredno');
    } else {
        await I.click('#declaredyes');
        await I.fillField('#helpWithFeesNumber', hwfReference);
    }

    await I.click('Save and continue');

    await I.waitInUrl('claim/total');
    await I.click('Save and continue');

    await I.click('Claim details');
    await I.waitInUrl('claim/reason');
    await I.fillField('#reason', 'broken door reason');
    await I.click('Save and continue');
    await I.waitInUrl('claim/timeline');
    await I.fillField('//input[@id="rows[0][date]"]', '22/11/2020');
    await I.fillField('//textarea[@id="rows[0][description]"]', 'he came and broke the door');
    await I.click('Save and continue');
    await I.waitInUrl('claim/evidence');
    await I.click('Save and continue');

    if (testConfig.env === 'aat') {
        await I.waitInUrl('start-page');
        await I.click('I don\'t want to answer these questions');
    }

    await I.waitInUrl('claim/task-list');
    await I.click('Check and submit your claim');
    await I.waitInUrl('claim/check-and-send');
    await I.see('Help With Fees reference number');
    await I.click('#signedtrue');
    await I.click('Submit claim');
    if (hwfReference === '') {
        await I.click('Submit and continue to payment (£35)');
        await I.waitInUrl('card_details');
        await I.enterPaymentDetails();
        await I.confirmPayment();
    }
}

async function createClaimWithHwfOptions(hwf = 'yes', insistHwfAfterReadingInfo = 'yes', hwfReference = 'HWF-123-456') {
    const I = this;
    await I.amOnCitizenAppPage('eligibility');
    await I.click('Continue');
    await I.waitInUrl('eligibility/claim-value');
    await I.click('input[id=claimValueUNDER_10000]');
    await I.click('Save and continue');
    await I.waitInUrl('eligibility/single-defendant');
    await I.click('input[id=singleDefendantno]');
    await I.click('Save and continue');
    await I.waitInUrl('eligibility/defendant-address');
    await I.click('input[id=defendantAddressyes]');
    await I.click('Save and continue');
    await I.waitInUrl('eligibility/claim-type');
    await I.click('input[id=claimTypePERSONAL_CLAIM]');
    await I.click('Save and continue');
    await I.waitInUrl('eligibility/claimant-address');
    await I.click('input[id=claimantAddressyes]');
    await I.click('Save and continue');
    await I.waitInUrl('eligibility/claim-is-for-tenancy-deposit');
    await I.click('input[id=claimIsForTenancyDepositno]');
    await I.click('Save and continue');
    await I.waitInUrl('eligibility/government-department');
    await I.click('input[id=governmentDepartmentno]');
    await I.click('Save and continue');
    await I.waitInUrl('eligibility/defendant-age');
    await I.click('input[id=defendantAgeyes]');
    await I.click('Save and continue');
    await I.waitInUrl('eligibility/over-18');
    await I.click('input[id=eighteenOrOveryes]');
    await I.click('Save and continue');
    await I.waitInUrl('eligibility/help-with-fees');
    if (hwf === 'yes') {
        await I.click('input[id=helpWithFeesyes]');
        await I.click('Save and continue');
        await I.waitInUrl('eligibility/information-about-help-with-fees');
        if (insistHwfAfterReadingInfo === 'yes') {
            await I.click('input[id=infoAboutHwFeligibilityyes]');
            await I.click('Save and continue');
            await I.waitInUrl('eligibility/apply-for-help-with-fees');
            await I.see('Apply for Help with Fees (opens in a new window)');
            await I.click('Save and Continue');
            await I.waitInUrl('eligibility/help-with-fees-reference');
            if (hwfReference === '') {
                await I.click('input[id=helpWithFeesReferenceno]');
                await I.see('Apply for Help with Fees (opens in a new tab)');
                await I.click('Save and continue');
                await I.waitInUrl('eligibility/hwf-eligible');
                await I.see('You will have to pay court fees unless you are eligible for Help with Fees. Find out more about Help with Fees (opens in a new window)');
                await I.click('Continue');
                await I.waitInUrl('claim/task-list');
            } else {
                await I.click('input[id=helpWithFeesReferenceyes]');
                await I.click('Save and continue');
                await I.waitInUrl('eligibility/hwf-eligible-reference');
                await I.see('Remember that you will not know about the fee until we have processed your Help with Fees application. Your claim will only be issued after Help with Fees is confirmed, or the fee is paid.');
                await I.click('Continue');
                await I.waitInUrl('claim/task-list');
            }
            await I.fillClaimDetails(hwfReference);
        } else {
            await I.click('input[id=infoAboutHwFeligibilityno]');
            await I.click('Save and continue');
            await I.waitInUrl('eligibility/help-with-fees');
            await I.click('input[id=helpWithFeesno]');
            await I.click('Save and continue');
            await I.waitInUrl('eligibility/eligible');
            await I.see('You can use this service');
            await I.click('Continue');
            await I.waitInUrl('claim/task-list');
            await I.click('Sign out');
        }
    } else {
        await I.click('input[id=helpWithFeesno]');
        await I.click('Save and continue');
        await I.waitInUrl('eligibility/eligible');
        await I.see('You can use this service');
        await I.click('Continue');
        await I.waitInUrl('claim/task-list');
        await I.click('Sign out');
    }
    await I.waitInUrl('/confirmation');
    const claimRef = await I.extractClaimRef();
    return claimRef.replace(/-/g, '');
}

module.exports = {
    createClaimWithHwfOptions,
    fillClaimDetails
};
