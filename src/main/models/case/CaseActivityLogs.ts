import {Logs} from '../Logs';

export interface CaseActivityLog {
  userId: string;
  caseAction: string;
  caseRef: string;
  caseJurisdictionId: string;
  caseTypeId: string;
  timestamp: string;
}

export class CaseActivityLogs extends Logs<CaseActivityLog> {
  public _fields: string[] = ['userId', 'caseAction', 'caseRef', 'caseJurisdictionId', 'caseTypeId', 'timestamp'];
}
