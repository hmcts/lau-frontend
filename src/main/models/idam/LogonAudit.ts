import {LogonLog} from './LogonLogs';

export interface LogonAudit {
  logonLog: LogonLog[];
  startRecordNumber: number;
  moreRecords: boolean;
}
