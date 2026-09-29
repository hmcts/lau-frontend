'use strict';

import testConfig from '../../../config.cjs';
import { tryTo } from 'codeceptjs/effects';

export default async function (givenUserType, isAlreadyAtSignOnPage = false) {
  const I = this;
  const user = testConfig.Auditor;

  if (!isAlreadyAtSignOnPage) {
    await I.amOnLoadedPage('/');
  }

  // console.log('IDAM user:', {
  //   givenUserType,
  //   hasUser: Boolean(user),
  //   hasEmail: Boolean(user?.email),
  //   hasPassword: Boolean(user?.password),
  //   currentUrl: await I.grabCurrentUrl(),
  // });

  const didModernLoginWork = await tryTo(async () => {
    I.see('Enter your email address', 'h1');
    I.fillField('#email', user.email);
    I.click('Continue');

    I.see('Enter your password', 'h1');
    I.fillField('#password', user.password);
    I.click('Continue');
  });

  if (!didModernLoginWork) {
    throw new Error('Classic and modern login both failed.');
  }
  await I.waitForText(
    'Log and Audit',
    testConfig.TestTimeToWaitForText,
  );

  await I.waitForInvisible(
    '.loading-overlay',
    testConfig.TestTimeToWaitForText,
  );
};
