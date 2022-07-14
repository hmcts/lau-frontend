import {DeletionModes} from './CaseDeletionsSearchRequest';
import {Logs} from '../Logs';

export interface CaseDeletionsLog {
  caseRef: string;
  caseJurisdictionId: string;
  caseTypeId: string;
  deletionMode: DeletionModes;
  timestamp: string;
}

export class CaseDeletionsLogs extends Logs<CaseDeletionsLog> {
  public _fields: string[] = ['caseRef', 'caseJurisdictionId', 'caseTypeId', 'deletionMode', 'timestamp'];
}
