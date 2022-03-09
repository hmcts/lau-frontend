'use strict';

const testConfig = require('../../config');
const caseHelper = require('../ccdApi/caseHelper');
const {caseEventId} = require('../common/Constants');

const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);

Feature('Judge Draw Direction Order (JDDO - claim amount > 500)').retry(testConfig.TestRetryFeatures);

Scenario('Full Defence → Dispute All → Reject mediation by Defendant → Decide to proceed is Yes (claimant)', async ({I}) => {
    const createCitizenCaseJson = require('../fixtures/data/JDDODisputeAllBothRejectMediation');
    await runFeatureTestSteps(I, createCitizenCaseJson);
}).tag('@crossbrowser')
    .retry(testConfig.TestRetryScenarios);

async function runFeatureTestSteps(I, createCitizenCaseJson) {
    await caseHelper.setUpApiAuthToken(testConfig.citizenUser);

    logger.info({message: 'Creating a case in ccd with given json'});
    const updatedCaseJson = await caseHelper.createOpenCase(I, createCitizenCaseJson);
    const caseId = updatedCaseJson.id;

    logger.info({message: 'Created a case in ccd with id: ', caseId});

    await caseHelper.updateApiEvent(caseEventId.CLAIMANT_REJECTS, updatedCaseJson, caseId);
    await caseHelper.updateApiEvent(caseEventId.ASSIGN_FOR_JUDGE_DIRECTIONS, updatedCaseJson, caseId);
    logger.info({message: 'Case is updated to READY FOR DIRECTIONS - JUDGE: ', caseId});

    await caseHelper.JudgeDrawDirectionOrder(I, updatedCaseJson, caseId);
    await caseHelper.signOut(I);
}
