import type {Request} from 'express';
import type {Session} from 'express-session';
import type {CaseSearchRequest} from './case/CaseSearchRequest';
import type {LogonSearchRequest} from './idam/LogonSearchRequest';
import type {CaseDeletionsSearchRequest} from './deletions/CaseDeletionsSearchRequest';
import type {DeletedUsersSearchRequest} from './user-deletions/DeletedUsersSearchRequest';
import type {CaseChallengedAccessRequest} from './challenged-access/CaseChallengedAccessRequest';
import type {UserDetailsSearchRequest} from './user-details/UserDetailsSearchRequest';
import type {UserDetailsViewModel} from './user-details/UserDetailsAuditData';

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
  userDetailsData?: UserDetailsViewModel;
  caseFormState?: Partial<CaseSearchRequest>;
  logonFormState?: Partial<LogonSearchRequest>;
  caseDeletionsFormState?: Partial<CaseDeletionsSearchRequest>;
  deletedUsersFormState?: Partial<DeletedUsersSearchRequest>;
  caseChallengedAccessFormState?: Partial<CaseChallengedAccessRequest>;
  userDetailsFormState?: Partial<UserDetailsSearchRequest>;
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
