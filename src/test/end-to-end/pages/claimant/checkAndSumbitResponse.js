module.exports = async function(claimantITP = 'no') {
    const I = this;
    await I.click('Check and submit your response');
    await I.waitInUrl('claimant-response/check-and-send');
    if (claimantITP === 'yes') {
        await I.click('#directionsQuestionnaireSignedtrue');
    }
    await I.click('input[type="submit"]');
};
