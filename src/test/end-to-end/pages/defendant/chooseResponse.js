module.exports = async function(response) {
    const I = this;
    await I.waitInUrl('response/task-list');
    await I.click('Choose a response');
    await I.waitInUrl('response/response-type');
    if (response === 'STATESPAID') {
        await I.click('//input[@id="type[value]DEFENCE"]');
    } else {
        await I.click(`//input[@id="type[value]${response}"]`);
    }
    await I.wait(2);
    await I.click('Save and continue');
    if (response === 'PART_ADMISSION') {
        await I.waitInUrl('partial-admission/already-paid');
        await I.click('//input[@id="optionno"]');
        await I.click('Save and continue');
    } else if (response === 'DEFENCE') {
        await I.waitInUrl('response/reject-all-of-claim');
        await I.click('//input[@id="optiondispute"]');
        await I.click('Save and continue');
        await I.waitInUrl('response/task-list');
        await I.click('Tell us why you disagree with the claim');
        await I.waitInUrl('response/your-defence');
        await I.fillField('#text', 'I am disagreeing for the claim');
        await I.click('Save and continue');
        await I.waitInUrl('response/timeline');
        await I.fillField('#comment', 'No timeline events');
        await I.click('Save and continue');
        await I.waitInUrl('response/evidence');
        await I.fillField('#comment', 'No evidence events');
        await I.click('Save and continue');
    } else if (response === 'STATESPAID') {
        await I.waitInUrl('response/reject-all-of-claim');
        await I.click('//input[@id="optionalreadyPaid"]');
        await I.click('Save and continue');

        await I.click('Tell us how much you’ve paid');
        await I.waitInUrl('response/full-rejection/how-much-have-you-paid');
        await I.fillField('#amount', '50');
        await I.fillField('//input[@id="date[day]"]', 23);
        await I.fillField('//input[@id="date[month]"]', 9);
        await I.fillField('//input[@id="date[year]"]', 2020);
        await I.fillField('#text', 'By bank transfer to his account');
        await I.click('Save and continue');
        await I.waitInUrl('response/full-rejection/you-have-paid-less');
        await I.click('input[type="submit"]');
        await I.click('Why do you disagree with the amount claimed?');
        await I.waitInUrl('response/full-rejection/why-do-you-disagree');
        await I.fillField('#text', 'I owe only specified amount');
        await I.click('Save and continue');
        await I.waitInUrl('response/timeline');
        await I.fillField('#comment', 'No timeline events');
        await I.click('Save and continue');
        await I.waitInUrl('response/evidence');
        await I.fillField('#comment', 'No evidence events');
        await I.click('Save and continue');

    }
};
