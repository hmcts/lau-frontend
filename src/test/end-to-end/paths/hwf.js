'use strict';

const caseHelper = require('../ccdApi/caseHelper');
const {userType} = require('../common/Constants');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const testConfig = require('src/test/config.js');

Feature('HWF functionality').retry(testConfig.TestRetryFeatures);

Scenario('Claimant create a hwf case --> Caseworker submit updated', async ({I}) => {
    await I.amOnCitizenAppPage('');
    await I.authenticateWithIdam(userType.CITIZEN, true);
    const caseId = await I.createClaimWithHwfOptions();
    await I.click('Sign out');

    logger.info({message: 'Created a claim in ccd with claim ref: ', caseId});

    //login as caseworker and verify created event
    await I.authenticateWithIdam(userType.CASEWORKER);
    await I.amOnPage(`/case/${testConfig.definition.jurisdiction}/${testConfig.definition.caseType}/` + caseId);
    await I.waitForText('Help With Fees claim created');
    await I.see('HWF-123-456');
    await caseHelper.updatedHWFNumber(I, 'HWF-456-789');
    await I.see('HWF-456-789');
    await caseHelper.invalidHWFNumber(I);

}).retry(testConfig.TestRetryScenarios);
