const fields = {
    claimReference: 'div.reference-number > h1.bold-large'
};

module.exports = async function() {
    const I = this;
    return I.grabTextFrom(fields.claimReference);
};
