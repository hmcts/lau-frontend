import {Application, Response} from 'express';
import {AppRequest} from '../models/appRequest';
import config from 'config';
import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');
const logger: LoggerInstance = Logger.getLogger('routes/home.ts');

async function homeHandler(req: AppRequest, res: Response) {
  logger.info('Home handler called:');
  logger.info(Date.now().toString());

  const caseFormState = req.session?.caseFormState || {};
  const logonFormState = req.session?.logonFormState || {};
  const caseDeletionsFormState = req.session?.caseDeletionsFormState || {};
  const sessionErrors = req.session?.errors || [];
  const caseActivities = req.session?.caseActivities;
  const caseSearches = req.session?.caseSearches;
  const logons = req.session?.logons;
  const caseDeletions = req.session?.caseDeletions;

  const renderOptions = {
    common: {
      maxRecords: Number(config.get('pagination.maxTotal')),
    },
    caseForm: caseFormState,
    logonForm: logonFormState,
    caseDeletionsForm: caseDeletionsFormState,
    caseActivities,
    caseSearches,
    logons,
    caseDeletions,
    sessionErrors,
    errors: {
      caseSearchForm: {
        stringFieldRequired: 'Please enter at least one of the following fields: User ID, Case Type ID, Case Ref or Jurisdiction ID.',
        startDateBeforeEndDate: '\'Time from\' must be before \'Time to\'',
      },
      logonSearchForm: {
        stringFieldRequired: 'Please enter at least one of the following fields: User ID or Email',
        startDateBeforeEndDate: '\'Time from\' must be before \'Time to\'',
      },
      caseDeletionsSearchForm: {
        stringFieldRequired: 'Please enter at least one of the following fields: Case Type ID, Case Ref or Jurisdiction ID.',
        startDateBeforeEndDate: '\'Time from\' must be before \'Time to\'',
      },
      startTimestamp: {
        invalid: 'Invalid \'Time from\' timestamp.',
        required: '\'Time from\' is required.',
      },
      endTimestamp: {
        invalid: 'Invalid \'Time to\' timestamp.',
        required: '\'Time to\' is required.',
      },
      caseRef: {
        invalid: 'Case Reference must be 16 digits.',
      },
    },
  };

  logger.info('Setting 25s timeout for testing:');
  setTimeout(() => {
    logger.info('Calling render:');
    res.render('home/template', renderOptions);
  }, 25000);
}

export default function (app: Application): void {
  app.get('/', homeHandler);
}
