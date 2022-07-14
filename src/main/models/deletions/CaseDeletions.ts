import {CaseDeletionsLog} from './CaseDeletionsLogs';

export interface CaseDeletions {
  deletionsLog: CaseDeletionsLog[];
  startRecordNumber: number;
  moreRecords: boolean;
  totalNumberOfRecords: number;
}
