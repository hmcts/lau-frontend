module.exports = async function(type = 'ccj', admitType = '', jddo = 'no', acceptPaymentPlan = 'yes', defendantType = 'INDIVIDUAL') {
    const I = this;
    await I.waitInUrl('claimant-response/task-list');
    if (admitType === 'PART_ADMISSION' && jddo === 'yes') {
        await I.click('Accept or reject the £2');
        await I.waitInUrl('claimant-response/settle-admitted');
        await I.click('#admittedno');
        await I.click('Save and continue');
    } else {
        if (admitType === 'PART_ADMISSION') {
            await I.click('Accept or reject the £2');
            await I.waitInUrl('claimant-response/settle-admitted');
            await I.click('#admittedyes');
            await I.click('Save and continue');
            await I.waitInUrl('claimant-response/task-list');
        }
        await I.click('Accept or reject their repayment plan');
        await I.waitInUrl('claimant-response/accept-payment-method');
        if (acceptPaymentPlan === 'no') {
            await I.click('//input[@id="acceptno"]');
            await I.click('Save and continue');
            await I.waitInUrl('claimant-response/task-list');
            await I.click('Propose an alternative repayment plan');
            await I.waitInUrl('claimant-response/payment-option');
            await I.click('//input[@id="optionBY_SPECIFIED_DATE"]');
            await I.click('Save and continue');
            await I.waitInUrl('claimant-response/payment-date');
            await I.fillField('//input[@id="date[day]"]', 23);
            await I.fillField('//input[@id="date[month]"]', 9);
            await I.fillField('//input[@id="date[year]"]', 2025);
            await I.click('Save and continue');
            if (defendantType === 'INDIVIDUAL' || defendantType === 'SOLE TRADER') {
                await I.waitInUrl('claimant-response/pay-by-set-date-accepted');
                await I.click('Continue');
            } else {
                return;
            }
        } else {
            await I.click('//input[@id="acceptyes"]');
            await I.click('Save and continue');
        }
        await I.waitInUrl('claimant-response/task-list');
        await I.click('Choose how to formalise repayment');
        await I.waitInUrl('claimant-response/choose-how-to-proceed');
        if (type === 'signAgreement') {
            await I.click('//input[@id="optionsignSettlementAgreement"]');
        } else if (type === 'ccj') {
            await I.click('//input[@id="optionrequestCCJ"]');
        }
        await I.click('Save and continue');
    }
};
