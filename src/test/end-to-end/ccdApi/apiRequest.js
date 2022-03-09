const config = require('../../config.js');

const idamHelper = require('./idamHelper');
const restHelper = require('./restHelper.js');
const totp = require('totp-generator');

const tokens = {};
const getCcdDataStoreBaseUrl = () => `${config.url.ccdDataStore}/citizens/${tokens.userId}/jurisdictions/${config.definition.jurisdiction}/case-types/${config.definition.caseType}`;
const getCcdCaseUrl = (userId, caseId) => `${config.url.ccdDataStore}/aggregated/citizens/${userId}/jurisdictions/${config.definition.jurisdiction}/case-types/${config.definition.caseType}/cases/${caseId}`;
const getRequestHeaders = (userAuth) => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userAuth}`,
        'ServiceAuthorization': tokens.s2sAuth
    };
};

module.exports = {
    setupTokens: async (user) => {
        tokens.userAuth = await idamHelper.accessToken(user);
        tokens.userId = await idamHelper.userId(tokens.userAuth);
        tokens.s2sAuth = await restHelper.retriedRequest(
            `${config.url.authProviderApi}/lease`,
            {'Content-Type': 'application/json'},
            {
                microservice: config.s2s.microservice,
                oneTimePassword: totp(config.s2s.secret)
            })
            .then(response => response.text());
    },

    fetchCaseForDisplay: async(user, caseId) => {
        const eventUserAuth = await idamHelper.accessToken(user);
        const eventUserId = await idamHelper.userId(eventUserAuth);
        const url = getCcdCaseUrl(eventUserId, caseId);

        return await restHelper.retriedRequest(url, getRequestHeaders(eventUserAuth), null, 'GET')
            .then(response => response.json());
    },

    startEvent: async (eventName, caseId) => {
        let url = getCcdDataStoreBaseUrl();
        if (caseId) {
            url += `/cases/${caseId}`;
        }
        url += `/event-triggers/${eventName}/token`;

        const response = await restHelper.retriedRequest(url, getRequestHeaders(tokens.userAuth), null, 'GET')
            .then(response => response.json());
        tokens.ccdEvent = response.token;
        return response.case_details.case_data || {};
    },

    submitEvent: async (eventName, caseData, caseId) => {
        let url = `${getCcdDataStoreBaseUrl()}/cases`;
        if (caseId) {
            url += `/${caseId}/events`;
        }

        return await restHelper.retriedRequest(url, getRequestHeaders(tokens.userAuth),
            {
                data: caseData,
                event: {id: eventName},
                event_data: caseData,
                event_token: tokens.ccdEvent
            }, 'POST', 201);
    }
};
