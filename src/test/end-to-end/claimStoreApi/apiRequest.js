const idamHelper = require('../ccdApi/idamHelper');
const restHelper = require('../ccdApi//restHelper.js');
const testConfig = require('src/test/config');

const getRequestHeaders = (userAuth) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userAuth}`
    };
};

module.exports = {
    retrieveByReferenceNumber: async (referenceNumber) => {
        if (!referenceNumber) {
            return 'Claim reference number is required';
        }
        const userAuth = await idamHelper.accessToken(testConfig.citizenUser);
        const url = `${testConfig.url.claimStore}/claims/${referenceNumber}`;

        return await restHelper.retriedRequest(url, getRequestHeaders(userAuth), null, 'GET')
            .then(response => response.json());
    }
};
