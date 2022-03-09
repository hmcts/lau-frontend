module.exports = async function(type) {
    const I = this;
    await I.waitInUrl('response/task-list');
    await I.click('How much money do you admit you owe?');
    await I.waitInUrl('partial-admission/how-much-do-you-owe');
    await I.fillField('//input[@id="amount"]', 2);
    await I.click('Save and continue');

    await I.waitInUrl('response/task-list');
    await I.click('Why do you disagree with the amount claimed?');
    await I.fillField('#text', 'I am not happy with claimed amount');
    await I.click('Save and continue');
    await I.waitInUrl('response/timeline');
    await I.wait(1);
    await I.click('Save and continue');
    await I.waitInUrl('response/evidence');
    await I.wait(1);
    await I.click('Save and continue');

    await I.waitInUrl('response/task-list');
    await I.click('When will you pay the £2?');
    if (type === 'specificDate') {
        await I.click('//input[@id="optionBY_SPECIFIED_DATE"]');
        await I.click('Save and continue');

        await I.waitInUrl('response/partial-admission/payment-date');
        await I.fillField('//input[@id="date[day]"]', 23);
        await I.fillField('//input[@id="date[month]"]', 9);
        await I.fillField('//input[@id="date[year]"]', 2025);
        await I.click('Save and continue');
    } else if (type === 'ownWay') {
        await I.click('//input[@id="optionINSTALMENTS"]');
        await I.click('Save and continue');
    }
};
