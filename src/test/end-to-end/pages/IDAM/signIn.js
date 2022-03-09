'use strict';

const testConfig = require('src/test/config.js');
const {userType} = require('../../common/Constants');

module.exports = async function (givenUserType, isAlreadyAtSignOnPage = false) {
    const I = this;
    let user = '';

    if (!isAlreadyAtSignOnPage) {
        await I.amOnLoadedPage('/');
    }

    await I.waitForText('Sign in');

    switch (givenUserType) {
    case userType.JUDGE:
        user = testConfig.JudgeUser;
        break;
    case userType.LA:
        user = testConfig.LegalAdvisorUser;
        break;
    case userType.CASEWORKER:
        user = testConfig.CaseWorkerUser;
        break;
    case userType.CITIZEN:
        user = testConfig.citizenUser;
        break;
    default:
    }

    await I.fillField('#username', user.email);
    await I.fillField('#password', user.password);

    await I.waitForNavigationToComplete('input[type="submit"]');
    await I.wait(3);
};
