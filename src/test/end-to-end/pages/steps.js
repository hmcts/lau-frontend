'use strict';

const requireDirectory = require('require-directory');
const steps = requireDirectory(module);

module.exports = function () {
  return actor({
    authenticateWithIdam: steps.IDAM.signIn,
    performCaseAuditSearch:steps.lauHomePage.caseAuditSearch,
  });
};
