const testConfig = require('../../../config');

const fields = {
    card: {
        number: '#card-no',
        expiryDate: {
            month: '#expiry-month',
            year: '#expiry-year'
        },
        name: '#cardholder-name',
        verificationCode: '#cvc'
    },
    address: {
        line1: '#address-line-1',
        city: '#address-city',
        postcode: '#address-postcode'
    },
    email: '#email'
};

const cardDetails = {
    number: '4444333322221111',
    expiryMonth: '12',
    expiryYear: '25',
    name: 'John Smith',
    verificationCode: '999'
};

const billingDetails = {
    line1: '221B Baker Street',
    line2: 'Baker Street',
    city: 'London',
    postcode: 'NW1 6XE'
};

module.exports = async function() {
    const I = this;
    await I.waitForText('Enter card details');
    await I.fillField(fields.card.number, cardDetails.number);
    await I.fillField(fields.card.expiryDate.month, cardDetails.expiryMonth);
    await I.fillField(fields.card.expiryDate.year, cardDetails.expiryYear);
    await I.fillField(fields.card.name, cardDetails.name);
    await I.fillField(fields.card.verificationCode, cardDetails.verificationCode);
    await I.fillField(fields.address.line1, billingDetails.line1);
    await I.fillField(fields.address.city, billingDetails.city);
    await I.fillField(fields.address.postcode, billingDetails.postcode);
    await I.fillField(fields.email, testConfig.citizenUser.email);
    await I.executeScript(function () {
        document.getElementById('card-details').submit();
    });
};
