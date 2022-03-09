module.exports = async function(optForMediation, type = 'INDIVIDUAL') {
    const I = this;
    await I.waitInUrl('response/task-list');
    await I.click('Free telephone mediation');

    if (optForMediation === 'yes') {
        await I.waitInUrl('/free-telephone-mediation');
        await I.click('Continue');
        if (type === 'LIMITED COMPANY' || type === 'ORG') {
            await I.waitForText('Who should the mediation service call');
            await I.fillField('#mediationContactPerson', 'Test');
            await I.fillField('#mediationPhoneNumber', '0788788788');
        } else {
            await I.waitInUrl('mediation/can-we-use');
            await I.click('#freeMediationOptionNO');
            await I.fillField('#mediationPhoneNumber', '0788788788');
        }
        await I.click('Save and continue');
    } else {
        await I.click('I do not agree to free mediation');

        await I.waitInUrl('mediation/mediation-disagreement');
        await I.click('//input[@id="optionno"]');
        await I.click('Save and continue');
        await I.waitInUrl('/i-dont-want-free-mediation');
        await I.click('Skip this section');
    }

    /*  if (optForMediation === 'yes') {

        await I.waitInUrl('mediation/free-mediation');
        await I.click('input[type="submit"]');
        await I.waitInUrl('mediation/how-mediation-works');
        await I.click('Continue');

        await I.waitInUrl('mediation/will-you-try-mediation');
        await I.click('#optionyes');
        await I.click('Save and continue');

        await I.waitInUrl('mediation/mediation-agreement');
        await I.click('I agree');

        await I.waitInUrl('mediation/can-we-use');
        await I.click('#optionyes');
        //await I.fillField('#mediationPhoneNumber', '0788788788');
        await I.click('Save and continue');
    } else {

        await I.waitInUrl('mediation/free-mediation');
        await I.click('input[type="submit"]');
        await I.waitInUrl('mediation/how-mediation-works');
        await I.click('I don’t want to try free mediation');
        await I.waitInUrl('mediation/mediation-disagreement');
        await I.click('#optionno');
        await I.click('Save and continue');
    }   */
};
