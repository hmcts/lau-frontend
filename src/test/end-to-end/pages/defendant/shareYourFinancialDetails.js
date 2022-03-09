module.exports = async function(type = 'Individual') {
    const I = this;
    await I.waitInUrl('response/task-list');
    await I.click('Share your financial details');
    if (type === 'ORG' || type === 'LIMITED COMPANY') {
        await I.waitInUrl('/send-company-financial-details');
        await I.click('Continue');
    } else {
        await I.waitInUrl('statement-of-means/intro');
        await I.click('input[type="submit"]');

        await I.waitInUrl('statement-of-means/bank-accounts');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/disability');
        await I.click('//input[@id="optionno"]');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/residence');
        await I.click('//input[@id="typePRIVATE_RENTAL"]');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/partner/partner');
        await I.click('//input[@id="optionno"]');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/dependants');
        await I.click('//input[@id="declaredfalse"]');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/other-dependants');
        await I.click('//input[@id="declaredfalse"]');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/carer');
        await I.click('//input[@id="optionno"]');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/employment');
        await I.click('//input[@id="declaredfalse"]');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/unemployment');
        await I.click('//input[@id="optionRETIRED"]');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/court-orders');
        await I.click('//input[@id="declaredfalse"]');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/priority-debts');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/debts');
        await I.click('//input[@id="declaredfalse"]');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/monthly-expenses');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/monthly-income');
        await I.click('Save and continue');

        await I.waitInUrl('statement-of-means/explanation');
        await I.fillField('//textarea[@id="text"]', 'I cant pay immediately');
        await I.click('Save and continue');
    }
};
