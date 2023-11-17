import {Application, Response} from 'express';
import {AppRequest} from '../models/appRequest';
import config from 'config';
import {FeatureToggleService} from '../service/FeatureToggleService';

async function homeHandler(req: AppRequest, res: Response) {
  const caseFormState = req.session?.caseFormState || {};
  const logonFormState = req.session?.logonFormState || {};
  const caseDeletionsFormState = req.session?.caseDeletionsFormState || {};
  const deletedUsersFormState = req.session?.deletedUsersFormState || {};
  const sessionErrors = req.session?.errors || [];
  const caseActivities = req.session?.caseActivities;
  const caseSearches = req.session?.caseSearches;
  const logons = req.session?.logons;
  const caseDeletions = req.session?.caseDeletions;
  const userDeletions = req.session?.userDeletions;
  const featureToggleService = new FeatureToggleService();
  const deletedUsersFtValue = await featureToggleService.getDeletedUsersFeatureToggle();
  res.render('home/template', {
    common: {
      maxRecords: Number(config.get('pagination.maxTotal')),
    },
    caseForm: caseFormState,
    logonForm: logonFormState,
    caseDeletionsForm: caseDeletionsFormState,
    deletedUsersForm: deletedUsersFormState,

    caseActivities,
    caseSearches,
    logons,
    caseDeletions,
    userDeletions,
    sessionErrors,
    deletedUsersFtValue,
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
      deletedUsersSearchForm: {
        stringFieldRequired: 'Please enter at least one of the following fields: User ID , Email, First Name or Last Name',
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
  });
}

export default function (app: Application): void {
  app.get('/', homeHandler);
}
