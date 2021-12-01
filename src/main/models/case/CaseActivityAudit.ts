import {CaseActivityLog} from './CaseActivityLogs';

export interface CaseActivityAudit {
  actionLog: CaseActivityLog[];
  startRecordNumber: number;
  moreRecords: boolean;
}
