'use strict';

const testConfig = require('src/test/config.js');
const { tryTo } = require('codeceptjs/effects');

module.exports = async function (givenUserType, isAlreadyAtSignOnPage = false) {
  const I = this;
  const user = testConfig.Auditor;

  if (!isAlreadyAtSignOnPage) {
    await I.amOnLoadedPage('/');
  }

  const didClassicLoginWork = await tryTo(async () => {
    await I.waitForText('Sign in', testConfig.TestTimeToWaitForText);
    await I.fillField('#username', user.email);
    await I.fillField('#password', user.password);
    await I.waitForNavigationToComplete('input[type="submit"]');
  });

  if (didClassicLoginWork) {
    return;
  }

  const didModernLoginWork = await tryTo(async () => {
    await I.waitForText('Enter your email address', testConfig.TestTimeToWaitForText);
    await I.fillField('#email', user.email);
    await I.click('Continue');

    await I.waitForText('Enter your password', testConfig.TestTimeToWaitForText);
    await I.fillField('#password', user.password);
    await I.click('Continue');
  });

  if (didModernLoginWork) {
    return;
  }

  throw new Error('IDAM login page did not show classic or modern login form within the configured timeout.');
};
