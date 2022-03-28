'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = function () {
  return actor({
    authenticateWithIdam: steps.IDAM.signIn,
    performCaseAuditSearch: steps.lauHomePage.caseAuditSearch,
    performCaseSearch: steps.lauHomePage.caseSearch,
    performLogonAuditSearch: steps.lauHomePage.logonAuditSearch,
    performCaseAuditSearchWithoutSearchData: steps.lauHomePage.caseAuditSearchWithoutSearchData,
    performLogonAuditSearchWithoutSearchData: steps.lauHomePage.logonAuditSearch,
  });
};
