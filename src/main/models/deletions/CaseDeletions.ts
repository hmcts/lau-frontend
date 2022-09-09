import {CaseDeletionsLog} from './CaseDeletionsLogs';

export interface CaseDeletions {
  actionLog: CaseDeletionsLog[];
  startRecordNumber: number;
  moreRecords: boolean;
  totalNumberOfRecords: number;
}
