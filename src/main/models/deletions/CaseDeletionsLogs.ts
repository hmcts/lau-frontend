import {Logs} from '../Logs';

export interface CaseDeletionsLog {
  caseRef: string;
  caseJurisdictionId: string;
  caseTypeId: string;
  timestamp: string;
}

export class CaseDeletionsLogs extends Logs<CaseDeletionsLog> {
  public _fields: string[] = ['caseRef', 'caseJurisdictionId', 'caseTypeId', 'timestamp'];
}
