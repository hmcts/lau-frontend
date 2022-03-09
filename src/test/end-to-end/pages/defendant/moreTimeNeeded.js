module.exports = async function(needsTime) {
    const I = this;
    await I.waitInUrl('response/task-list');
    await I.click('Decide if you need more time to respond');
    await I.waitInUrl('response/more-time-request');
    await I.click(`#option${needsTime}`);
    await I.click('Save and continue');
};
