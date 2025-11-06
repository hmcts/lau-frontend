import {Application, Response} from 'express';
import {AppRequest, FormError, LogData} from '../models/appRequest';
import config from 'config';
import {CaseSearchRequest} from '../models/case/CaseSearchRequest';
import {LogonSearchRequest} from '../models/idam/LogonSearchRequest';
import {DeletedUsersSearchRequest} from '../models/user-deletions/DeletedUsersSearchRequest';
import {CaseDeletionsSearchRequest} from '../models/deletions/CaseDeletionsSearchRequest';
import {CaseChallengedAccessRequest} from '../models/challenged-access/CaseChallengedAccessRequest';
import {getCaseChallengedAccessLogOrder} from './../models/challenged-access/CaseChallengedAccessLogs';
import {UserDetailsSearchRequest} from '../models/user-details/UserDetailsSearchRequest';
import {UserDetailsAuditData} from '../models/user-details/UserDetailsAuditData';

interface Context {
  caseForm?: Partial<CaseSearchRequest>;
  logonForm?: Partial<LogonSearchRequest>;
  deletedUsersForm?: Partial<DeletedUsersSearchRequest>;
  caseDeletionsForm?: Partial<CaseDeletionsSearchRequest>;
  caseChallengedAccessForm?: Partial<CaseChallengedAccessRequest>;
  userDetailsForm?: Partial<UserDetailsSearchRequest>;
  caseSearchPage?: boolean;
  challengedSpecificAccessPage?: boolean;
  logonSearchPage?: boolean;
  userDeletionSearchPage?: boolean;
  caseDeletionSearchPage?: boolean;
  userDetailsPage?: boolean;
  caseActivities?: LogData;
  caseSearches?: LogData;
  logons?: LogData;
  userDeletions?: LogData;
  caseDeletions?: LogData;
  challengedAccessData?: LogData;
  userDetailsAuditData?: UserDetailsAuditData;
  jurisdictions?: {text: string, value: string}[];
  caseTypes?: {text: string, value: string}[];
}

async function homeHandler(req: AppRequest, res: Response) {
  req.session.fromPost = false;
  const roles = req.session.user?.roles;
  if (roles && roles.length == 1 && roles.includes('cft-service-logs')) {
    res.redirect('/case-deletion-audit');
  } else {
    res.redirect('/case-audit');
  }
}

async function auditHandler(req: AppRequest, res: Response, template: string, context: Context) {
  let sessionErrors: FormError[] = [];
  if (req.session.fromPost) {
    sessionErrors = req.session?.errors || [];
    req.session.fromPost = false;
  }
  return res.render(template, {
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
      caseChallengedAccessSearchForm: {
        stringFieldRequired: 'Please enter at least one of the following fields: Case Ref or User ID.',
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
      emailAddress: {
        invalid: 'Enter an email address in the correct format, like name@example.com',
      },
      userIdOrEmail: {
        required: 'Enter a user ID or email address',
        invalid: 'Enter valid user ID or email address',
        valueTooLong: 'Entered value is too long',
      },
    },
    caseChallengedAccessLogOrder: getCaseChallengedAccessLogOrder(),
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

export async function challengedSpecificAccessHandler(req: AppRequest, res: Response) {
  if(!res.locals.challengedAccessEnabled){
    return res.redirect('/');
  }
  const context: Context = {
    caseChallengedAccessForm: req.session?.caseChallengedAccessFormState || {},
    challengedSpecificAccessPage: true,
    challengedAccessData: req.session?.challengedAccessData,
  };
  await auditHandler(req, res, 'case-challenged-access/template.njk', context);
}

export async function userDetailsHandler(req: AppRequest, res: Response) {
  if (!config.get('pages.userDetailsEnabled')) {
    return res.redirect('/');
  }
  const context: Context = {
    userDetailsForm: req.session?.userDetailsFormState || {},
    userDetailsPage: true,
    userDetailsAuditData: req.session?.userDetailsData,
  };
  return auditHandler(req, res, 'user-details/template.njk', context);
}

export default function (app: Application): void {
  app.get('/', homeHandler);
  app.get('/case-audit', caseHandler);
  app.get('/logon-audit', logonHandler);
  app.get('/user-deletion-audit', userDeletionHandler);
  app.get('/case-deletion-audit', caseDeletionHandler);
  app.get('/challenged-specific-access', challengedSpecificAccessHandler);
  app.get('/user-details-audit', userDetailsHandler);
}
