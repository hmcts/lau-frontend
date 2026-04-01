'use strict';

const { tryTo } = require('codeceptjs');
const testConfig = require('src/test/config.js');

module.exports = async function (givenUserType, isAlreadyAtSignOnPage = false) {
  const I = this;
  const user = testConfig.Auditor;

  if (!isAlreadyAtSignOnPage) {
    await I.amOnLoadedPage('/');
  }

  const doClassicLogin = await tryTo(async () => {
    await I.waitForText('Sign in', testConfig.TestTimeToWaitForText);
    await I.fillField('#username', user.email);
    await I.fillField('#password', user.password);
    await I.waitForNavigationToComplete('input[type="submit"]');
  });

  if (doClassicLogin) {
    return;
  }

  const doModernLogin = await tryTo(async () => {
    await I.waitForText('Enter your email address', testConfig.TestTimeToWaitForText);
    await I.fillField('#email', user.email);
    await I.click('Continue');

    await I.waitForText('Enter your password', testConfig.TestTimeToWaitForText);
    await I.fillField('#password', user.password);
    await I.click('Continue');
  });

  if (doModernLogin) {
    return;
  }

};
