module.exports = async function(type = '') {
    const I = this;
    await I.click('View the defendant’s response');
    await I.waitInUrl('claimant-response/defendants-response');
    await I.click('input[type="submit"]');
    if (type === 'PART_ADMISSION') {
        await I.waitInUrl('claimant-response/defendants-response');
        await I.see('They’ve offered to pay you £2');
        await I.click('input[type="submit"]');
    }
};
