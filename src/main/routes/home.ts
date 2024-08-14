import {Application, Response} from 'express';
import {AppRequest, FormError, LogData} from '../models/appRequest';
import config from 'config';
import {CaseSearchRequest} from '../models/case/CaseSearchRequest';
import {LogonSearchRequest} from '../models/idam/LogonSearchRequest';
import {DeletedUsersSearchRequest} from '../models/user-deletions/DeletedUsersSearchRequest';
import {CaseDeletionsSearchRequest} from '../models/deletions/CaseDeletionsSearchRequest';

interface Context {
  caseForm?: Partial<CaseSearchRequest>;
  logonForm?: Partial<LogonSearchRequest>;
  deletedUsersForm?: Partial<DeletedUsersSearchRequest>;
  caseDeletionsForm?: Partial<CaseDeletionsSearchRequest>;
  caseSearchPage?: boolean;
  logonSearchPage?: boolean;
  userDeletionSearchPage?: boolean;
  caseDeletionSearchPage?: boolean;
  caseActivities?: LogData;
  caseSearches?: LogData;
  logons?: LogData;
  userDeletions?: LogData;
  caseDeletions?: LogData;
  jurisdictions?: {text: string, value: string}[];
  caseTypes?: {text: string, value: string}[];
}

async function homeHandler(req: AppRequest, res: Response) {
  req.session.fromPost = false;
  res.redirect('/case-audit');
}

async function auditHandler(req: AppRequest, res: Response, template: string, context: Context) {
  let sessionErrors: FormError[] = [];
  if (req.session.fromPost) {
    sessionErrors = req.session?.errors || [];
    req.session.fromPost = false;
  }
  res.render(template, {
    ...context,
    common: {
      maxRecords: Number(config.get('pagination.maxTotal')),
    },
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
      deletedUsersSearchForm: {
        stringFieldRequired: 'Please enter at least one of the following fields: User ID , Email, First Name or Last Name',
        startDateBeforeEndDate: '\'Time from\' must be before \'Time to\'',
      },
      caseDeletionsSearchForm: {
        stringFieldRequired: 'Please enter at least one of the following fields: Case Type ID, Case Ref or Jurisdiction ID.',
        startDateBeforeEndDate: '\'Time from\' must be before \'Time to\'',
      },
      startTimestamp: {
        invalid: 'Invalid \'Time from\' timestamp.',
        required: '\'Time from\' is required.',
        utcDateAndTime: '\'Time from\' should be in UTC',
      },
      endTimestamp: {
        invalid: 'Invalid \'Time to\' timestamp.',
        required: '\'Time to\' is required.',
        utcDateAndTime: '\'Time to\' should be in UTC',
      },
      caseRef: {
        invalid: 'Case Reference must be 16 digits.',
      },
      emailAddress: {
        invalid: 'Enter an email address in the correct format, like name@example.com',
      },
    },
  });
}

async function caseHandler(req: AppRequest, res: Response) {
  const context: Context = {
    caseForm: req.session?.caseFormState || {},
    caseSearchPage: true,
    caseActivities: req.session?.caseActivities,
    caseSearches: req.session?.caseSearches,
  };
  auditHandler(req, res, 'case-audit/template.njk', context);
}

async function logonHandler(req: AppRequest, res: Response) {
  const context: Context = {
    logonForm: req.session?.logonFormState || {},
    logonSearchPage: true,
    logons: req.session?.logons,
  };
  auditHandler(req, res, 'logons/template.njk', context);
}

async function userDeletionHandler(req: AppRequest, res: Response) {
  const context: Context = {
    deletedUsersForm: req.session?.deletedUsersFormState || {},
    userDeletionSearchPage: true,
    userDeletions: req.session?.userDeletions,
  };
  auditHandler(req, res, 'user-deletions/template.njk', context);
}

async function caseDeletionHandler(req: AppRequest, res: Response) {
  const context: Context = {
    caseDeletionsForm: req.session?.caseDeletionsFormState || {},
    caseDeletionSearchPage: true,
    caseDeletions: req.session?.caseDeletions,
  };
  auditHandler(req, res, 'case-deletions/template.njk', context);
}

export default function (app: Application): void {
  app.get('/', homeHandler);
  app.get('/case-audit', caseHandler);
  app.get('/logon-audit', logonHandler);
  app.get('/user-deletion-audit', userDeletionHandler);
  app.get('/case-deletion-audit', caseDeletionHandler);
}
