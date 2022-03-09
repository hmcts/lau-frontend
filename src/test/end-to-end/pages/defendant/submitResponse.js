const testConfig = require('../../../config');

module.exports = async function(type = '', defendantType = 'INDIVIDUAL') {
    const I = this;
    await I.waitInUrl('response/task-list');
    await I.click('Check and submit your response');
    if (testConfig.env === 'aat' && defendantType === 'INDIVIDUAL') {
        await I.waitInUrl('start-page');
        await I.click('I don\'t want to answer these questions');
    }
    await I.waitInUrl('response/check-and-send');
    if (defendantType === 'ORG' || defendantType === 'LIMITED COMPANY') {
        await I.fillField('#signerName', 'defendant full name');
        await I.fillField('#signerRole', 'defendant job title');
    }
    await I.click('#signedtrue');
    if (type === 'PART_ADMISSION' || type === 'DEFENCE') {
        await I.click('#directionsQuestionnaireSignedtrue');
    }
    await I.click('input[type="submit"]');
    await I.waitForText('submitted your response');
};
