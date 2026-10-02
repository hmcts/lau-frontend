'use strict';

import testConfig from '../../../config.cjs';

export default async function (givenUserType, isAlreadyAtSignOnPage = false) {
  const I = this;
  const user = testConfig.Auditor;

  if (!isAlreadyAtSignOnPage) {
    await I.amOnLoadedPage('/');
  }

  let loginStage = 'Checking email page';

  await I.see('Enter your email address', 'h1');
  loginStage = 'Submitting email';
  await I.fillField('#email', user.email);
  await I.click('Continue');

  loginStage = 'Password page';
  await I.see('Enter your password', 'h1');

  loginStage = 'Submitting password';
  await I.fillField('#password', user.password);
  await I.click('Continue');

  loginStage = 'Waiting for Log and Audit page';
  await I.waitForText('Log and Audit', testConfig.TestTimeToWaitForText);

  await I.waitForInvisible(
    '.loading-overlay',
    testConfig.TestTimeToWaitForText,
  );
};
