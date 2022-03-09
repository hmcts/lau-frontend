'use strict';

const testConfig = require('../../config');
const caseHelper = require('../ccdApi/caseHelper');
const {caseEventName} = require('../common/Constants');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

Feature('Mediation Unsuccessful)').retry(testConfig.TestRetryFeatures);

Scenario('Full Defence → Dispute All → Accept mediation by Defendant → Decide to proceed is Yes (claimant)→ Accept mediation by claimant', async ({I}) => {
    const createCitizenCaseJson = require('../fixtures/data/ReferMediationFullDefenceDisputeAll');
    await runFeatureTestSteps(I, createCitizenCaseJson);
}).retry(testConfig.TestRetryScenarios);

async function runFeatureTestSteps(I, createCitizenCaseJson) {
    await caseHelper.setUpApiAuthToken(testConfig.citizenUser);

    logger.info({message: 'Creating a case in ccd with given json'});
    const updatedCaseJson = await caseHelper.createOpenCase(I, createCitizenCaseJson);
    const caseId = updatedCaseJson.id;

    logger.info({message: 'Created a case in ccd with id: ', caseId});

    await caseHelper.updateCaseworkerEvent(I, caseEventName.REFERRED_MEDIATION, caseId);
    logger.info({message: 'Case status changed to REFFERED_MEDIATION for ', caseId});

    await caseHelper.updateMediationUnsuccessful(I);
    logger.info({message: 'Case is updated to MEDIATION_FAILED: ', caseId});

    await caseHelper.signOut(I);
}
