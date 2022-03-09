'use strict';

const testConfig = require('src/test/config.js');
const idamExpressTestHarness = require('@hmcts/div-idam-test-harness');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const idamArgs = {};

module.exports = {
    async createAUser(userEmail, userPwd) {
        idamArgs.testEmail = userEmail;
        idamArgs.testPassword = userPwd;
        idamArgs.testGroupCode = 'citizens';
        idamArgs.roles = [{code: 'citizen'}];
        idamArgs.idamApiUrl = testConfig.url.idamApi;

        process.env.USER_EMAIL = userEmail;
        process.env.USER_PASSWORD = userPwd;
        return idamExpressTestHarness.createUser(idamArgs, testConfig.proxy)
            .then(() => {
                logger.info(
                    null,
                    'idam_user_created',
                    `Created IDAM test user: ${idamArgs.testEmail}`
                );
            })
            .catch(error => {
                logger.info(
                    null, 'idam_user_created',
                    'Unable to create IDAM test user/token',
                    error
                );
                throw error;
            });
    },

    async deleteUser(userEmail, userPwd) {
        idamArgs.testEmail = userEmail;
        idamArgs.testPassword = userPwd;
        idamArgs.testGroupCode = 'citizens';
        idamArgs.roles = [{code: 'citizen'}];
        idamArgs.idamApiUrl = testConfig.url.idamApi;

        idamExpressTestHarness.removeUser(idamArgs, testConfig.proxy)
            .then(() => {
                logger.info(
                    null,
                    'idam_user_removed',
                    `Removed IDAM test user: ${idamArgs.testEmail}`
                );
            })
            .catch(error => {
                logger.info(
                    null,
                    'idam_user_remove_error',
                    'Unable to remove IDAM test user',
                    error
                );
            });
    }
};
