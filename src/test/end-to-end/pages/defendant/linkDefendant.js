module.exports = async function(claimRef, pinValue) {
    const I = this;
    await I.amOnCitizenAppPage('first-contact/start');
    await I.click('input[type="submit"]');

    await I.waitInUrl('first-contact/claim-reference');
    await I.fillField('#reference', claimRef);
    await I.click('input[type="submit"]');

    await I.wait(5);
    await I.waitInUrl('login/pin');
    await I.fillField('#pin', pinValue);
    await I.click('input[type="submit"]');
    await I.wait(5);
};
