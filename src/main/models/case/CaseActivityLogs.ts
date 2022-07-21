import {Logs} from '../Logs';

export enum CaseActions {'UPDATE' = 'UPDATE', 'CREATE' = 'CREATE', 'VIEW' = 'VIEW', 'DELETE' = 'DELETE'}

export interface CaseActivityLog {
  userId: string;
  caseAction: CaseActions;
  caseRef: string;
  caseJurisdictionId: string;
  caseTypeId: string;
  timestamp: string;
}

export class CaseActivityLogs extends Logs<CaseActivityLog> {
  public _fields: string[] = ['userId', 'caseAction', 'caseRef', 'caseJurisdictionId', 'caseTypeId', 'timestamp'];
}
