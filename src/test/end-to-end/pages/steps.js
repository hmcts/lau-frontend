'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = function () {
  return actor({
    authenticateWithIdam: steps.IDAM.signIn,
    performCaseAuditSearch: steps.lauHomePage.caseAuditSearch,
    performCaseSearch: steps.lauHomePage.caseSearch,
    performLogonAuditSearch: steps.lauHomePage.logonAuditSearch,
    performDeletedUsersSearch: steps.lauHomePage.deletedUsersSearch,
    performCaseChallengedAccessSearch: steps.lauHomePage.caseChallengedAccessSearch,
    performCaseAuditSearchWithoutSearchData: steps.lauHomePage.caseAuditSearchWithoutSearchData,
    performLogonAuditSearchWithoutSearchData: steps.lauHomePage.logonAuditSearchWithoutSearchData,
    performDeletedUsersSearchWithoutSearchData: steps.lauHomePage.deletedUsersSearchWithoutSearchData,
    performChallengedAccessSearchWithoutSearchData: steps.lauHomePage.caseChallengedAccessSearchWithoutSearchData,
  });
};
