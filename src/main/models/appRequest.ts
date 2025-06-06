import { Request } from 'express';
import { Session } from 'express-session';
import {CaseSearchRequest} from './case/CaseSearchRequest';
import {LogonSearchRequest} from './idam/LogonSearchRequest';
import {CaseDeletionsSearchRequest} from './deletions/CaseDeletionsSearchRequest';
import { DeletedUsersSearchRequest } from './user-deletions/DeletedUsersSearchRequest';
import { CaseChallengedAccessRequest } from './challenged-access/CaseChallengedAccessRequest';

export type FormError = {
  propertyName: string;
  errorType: string;
};

export interface AppRequest<T = Partial<CaseSearchRequest>> extends Request {
  session: AppSession;
  locals: {
    env: string;
  };
  body: T;
}

export interface AppSession extends Session {
  user: UserDetails;
  caseActivities?: LogData;
  caseSearches?: LogData;
  logons?: LogData;
  caseDeletions?: LogData;
  userDeletions?: LogData;
  challengedAccessData?: LogData;
  caseFormState?: Partial<CaseSearchRequest>;
  logonFormState?: Partial<LogonSearchRequest>;
  caseDeletionsFormState?: Partial<CaseDeletionsSearchRequest>;
  deletedUsersFormState?: Partial<DeletedUsersSearchRequest>;
  caseChallengedAccessFormState?: Partial<CaseChallengedAccessRequest>;
  fromPost: boolean;
  errors?: FormError[];
}

export interface LogData {
  hasData: boolean;
  rows: {text:string, classes?: string}[][];
  noOfRows: number;
  totalNumberOfRecords: number;
  startRecordNumber: number;
  moreRecords: boolean;
  currentPage: number;
  lastPage: number;
}

export interface UserDetails {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  idToken: string;
  id: string;
  roles: string[];
}
