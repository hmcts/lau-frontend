const buttons = {
    confirm: '#confirm'
};

module.exports = async function() {
    const I = this;
    await I.waitForText('Confirm your payment');
    await I.waitForNavigationToComplete(buttons.confirm);
};
