module.exports = async function() {
    const I = this;
    await I.waitInUrl('claimant-response/task-list');
    await I.click('Sign a settlement agreement');
    await I.waitInUrl('claimant-response/sign-settlement-agreement');
    await I.click('#signedtrue');
    await I.click('Save and continue');
};
