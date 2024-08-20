import {CaseChallengedAccessLog} from './CaseChallengedAccessLogs';

export interface CaseChallengedAccesses {
  accessLog: CaseChallengedAccessLog[];
  startRecordNumber: number;
  moreRecords: boolean;
  totalNumberOfRecords: number;
}
