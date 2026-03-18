'use strict';

const testConfig = require('src/test/config.js');

module.exports = async function (givenUserType, isAlreadyAtSignOnPage = false) {
  const I = this;
  const user = testConfig.Auditor;

  if (!isAlreadyAtSignOnPage) {
    await I.amOnLoadedPage('/');
  }
  let doClassicLogin = true;
  let doModernLogin = true;
  try 
  {
      await I.waitForText('Sign in', testConfig.TestTimeToWaitForText);
      await I.fillField('#username', user.email);
      await I.fillField('#password', user.password);
      await I.waitForNavigationToComplete('input[type="submit"]');
  } catch (e){
    doClassicLogin = false;
  }

  if (doClassicLogin) {
    return;
  }

  try{
    await I.waitForText('Enter your email address', testConfig.TestTimeToWaitForText);
    await I.fillField('#email', user.email);
    await I.click('Continue');

    await I.waitForText('Enter your password', testConfig.TestTimeToWaitForText);
    await I.fillField('#password', user.password);
    await I.click('Continue');
  } catch (e){
    doModernLogin = false;
  }

  if (doModernLogin) {
    return;
  }

};
