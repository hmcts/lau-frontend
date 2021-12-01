import {Application, Response} from 'express';
import {AppRequest} from '../models/appRequest';

function homeHandler(req: AppRequest, res: Response) {
  const caseFormState = req.session?.caseFormState || {};
  const logonFormState = req.session?.logonFormState || {};
  const sessionErrors = req.session?.errors || [];
  const caseActivities = req.session?.caseActivities;
  const caseSearches = req.session?.caseSearches;
  const logons = req.session?.logons;

  res.render('home/template', {
    caseForm: caseFormState,
    logonForm: logonFormState,
    caseActivities,
    caseSearches,
    logons,
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
      startTimestamp: {
        invalid: 'Invalid \'Time from\' timestamp.',
        required: '\'Time from\' is required.',
      },
      endTimestamp: {
        invalid: 'Invalid \'Time to\' timestamp.',
        required: '\'Time to\' is required.',
      },
    },
  });
}

export default function (app: Application): void {
  app.get('/', homeHandler);
}
