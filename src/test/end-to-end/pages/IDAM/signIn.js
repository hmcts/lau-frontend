'use strict';

const testConfig = require('src/test/config.js');

module.exports = async function (givenUserType, isAlreadyAtSignOnPage = false) {
  const I = this;
  const user = testConfig.Auditor;

  if (!isAlreadyAtSignOnPage) {
    await I.amOnLoadedPage('/');
  }

  if (testConfig.IdamSignInFlow === 'modern') {
    await I.waitForText('Enter your email address', testConfig.TestTimeToWaitForText);
    await I.fillField('#username', user.email);
    await I.click('Continue');

    await I.waitForText('Enter your password', testConfig.TestTimeToWaitForText);
    await I.fillField('#password', user.password);
    await I.click('Continue');
   
  } else {
    await I.waitForText('Sign in', testConfig.TestTimeToWaitForText);
    await I.fillField('#username', user.email);
    await I.fillField('#password', user.password);
    await I.click('Sign in');
    
  }
  
  await I.waitForNavigationToComplete('input[type="submit"]');

  
};
