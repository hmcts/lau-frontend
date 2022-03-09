module.exports = async function(type = 'INDIVIDUAL', claimantUser = 'no') {
    const I = this;
    await I.waitInUrl('response/task-list');
    await I.click('Give us details in case there’s a hearing');
    await I.waitInUrl('directions-questionnaire/support-required');
    await I.click('Save and continue');
    if (claimantUser === 'yes' || type === 'LIMITED COMPANY' || type === 'ORG' || type === 'SOLE TRADER') {
        await I.waitInUrl('directions-questionnaire/hearing-exceptional-circumstances');
        await I.click('#exceptionalCircumstancesyes');
        await I.fillField('#reason', 'I am far from this place');
        await I.click('Save and continue');
    }
    await I.waitInUrl('directions-questionnaire/hearing-location');
    await I.click('Save and continue');
    await I.waitInUrl('directions-questionnaire/expert');
    await I.click('Continue without an expert');
    await I.waitInUrl('directions-questionnaire/self-witness');
    await I.click('#optionno');
    await I.click('Save and continue');
    await I.waitInUrl('directions-questionnaire/other-witnesses');
    await I.click('#otherWitnessesno');
    await I.click('Save and continue');
    await I.waitInUrl('directions-questionnaire/hearing-dates');
    await I.click('#hasUnavailableDatesfalse');
    await I.click('Save and continue');
};
