'use strict';

const testConfig = require('src/test/config.js');
const { tryTo } = require('codeceptjs/effects');

module.exports = async function (givenUserType, isAlreadyAtSignOnPage = false) {
  const I = this;
  const user = testConfig.Auditor;

  if (!isAlreadyAtSignOnPage) {
    await I.amOnLoadedPage('/');
  }

  I.see('Enter your email address', 'h1');
  I.fillField('#email', user.email);
  I.click('Continue');

  I.see('Enter your password', 'h1');
  I.fillField('#password', user.password);
  I.click('Continue');
};
