'use strict';

const testConfig = require('src/test/config.js');

module.exports = async function (givenUserType, isAlreadyAtSignOnPage = false) {
  const I = this;
  const user = testConfig.Auditor;

  if (!isAlreadyAtSignOnPage) {
    await I.amOnLoadedPage('/');
  }

  await I.waitForText('Sign in', testConfig.TestTimeToWaitForText);

  await I.fillField('#username', user.email);
  await I.fillField('#password', user.password);

  await I.waitForNavigationToComplete('input[type="submit"]');
};
