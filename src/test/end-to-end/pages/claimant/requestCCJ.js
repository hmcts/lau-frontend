module.exports = async function() {
    const I = this;
    await I.waitInUrl('claimant-response/task-list');
    await I.click('Request a County Court Judgment');
    await I.waitInUrl('county-court-judgment/paid-amount');
    await I.click('//input[@id="optionno"]');
    await I.click('Save and continue');
    await I.waitInUrl('county-court-judgment/paid-amount-summary');
    await I.click('Continue');
};
