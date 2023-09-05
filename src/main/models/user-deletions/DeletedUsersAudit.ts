import {DeletedUsersLog} from './DeletedUsersLog';

export interface DeletedUsersAudit {
  deletionLogs: DeletedUsersLog[];
  startRecordNumber: number;
  moreRecords: boolean;
  totalNumberOfRecords: number;
}
