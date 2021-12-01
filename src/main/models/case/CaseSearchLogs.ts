import {Logs} from '../Logs';

export interface CaseSearchLog {
  userId: string;
  caseRefs: string[];
  timestamp: string;
}

export class CaseSearchLogs extends Logs<CaseSearchLog> {
  public _fields: string[] = ['userId', 'caseRefs', 'timestamp'];
}
