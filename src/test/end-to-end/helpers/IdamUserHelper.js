'use strict';

const testConfig = require('src/test/config.js');
const idamExpressTestHarness = require('@hmcts/div-idam-test-harness');

const idamArgs = {};

const logger = require('../logger');

const parseJson = body => {
  if (!body) {
    return body;
  }
  if (typeof body === 'object') {
    return body;
  }
  try {
    return JSON.parse(body);
  } catch (error) {
    return body;
  }
};

module.exports = {

  async createAUser(userEmail, userPwd, role = 'cft-audit-investigator') {

    idamArgs.testEmail = userEmail;
    idamArgs.testPassword = userPwd;
    idamArgs.roles = Array.isArray(role) ? role : [{code: role}];
    idamArgs.idamApiUrl = testConfig.url.idamApi;

    process.env.USER_EMAIL = userEmail;
    process.env.USER_PASSWORD = userPwd;
    return idamExpressTestHarness.createUser(idamArgs, testConfig.proxy)
      .then(body => {
        const createdUser = parseJson(body);
        logger.info(
          null,
          'idam_user_created',
          `Created IDAM test user: ${idamArgs.testEmail}`,
        );
        return createdUser;
      })
      .catch(error => {
        logger.info(
          null, 'idam_user_created',
          'Unable to create IDAM test user/token',
          error,
        );
        throw error;
      });
  },

  async deleteUser(userEmail, userPwd, role = 'cft-audit-investigator') {
    idamArgs.testEmail = userEmail;
    idamArgs.testPassword = userPwd;
    idamArgs.roles = Array.isArray(role) ? role : [{code: role}];
    idamArgs.idamApiUrl = testConfig.url.idamApi;

    idamExpressTestHarness.removeUser(idamArgs, testConfig.proxy)
      .then(() => {
        logger.info(
          null,
          'idam_user_removed',
          `Removed IDAM test user: ${idamArgs.testEmail}`,
        );
      })
      .catch(error => {
        logger.info(
          null,
          'idam_user_remove_error',
          'Unable to remove IDAM test user',
          error,
        );
      });
  },
};