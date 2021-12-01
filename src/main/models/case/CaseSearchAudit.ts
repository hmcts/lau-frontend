import {CaseSearchLog} from './CaseSearchLogs';

export interface CaseSearchAudit {
  searchLog: CaseSearchLog[];
  startRecordNumber: number;
  moreRecords: boolean;
}
