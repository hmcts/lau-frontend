import { Request } from 'express';
import { Session } from 'express-session';
import type { LoggerInstance } from 'winston';
import {CaseSearchRequest} from './case/CaseSearchRequest';
import {LogonSearchRequest} from './idam/LogonSearchRequest';

export type FormError = {
  propertyName: string;
  errorType: string;
};

export interface AppRequest<T = Partial<CaseSearchRequest>> extends Request {
  session: AppSession;
  locals: {
    env: string;
    logger: LoggerInstance;
  };
  body: T;
}

export interface AppSession extends Session {
  user: UserDetails;
  caseActivities?: LogData;
  caseSearches?: LogData;
  logons?: LogData;
  caseFormState?: Partial<CaseSearchRequest>;
  logonFormState?: Partial<LogonSearchRequest>;
  errors?: FormError[];
}

export interface LogData {
  hasData: boolean;
  rows: {text:string, classes?: string}[][];
  noOfRows: number;
  startRecordNumber: number;
  moreRecords: boolean;
  currentPage: number;
}

export interface UserDetails {
  accessToken: string;
  idToken: string;
  id: string;
  roles: string[];
}
