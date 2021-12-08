import {Logs} from '../Logs';

export interface LogonLog {
  userId: string;
  emailAddress: string;
  service: string;
  ipAddress: string;
  timestamp: string;
}

export class LogonLogs extends Logs<LogonLog> {
  public _fields: string[] = ['userId', 'emailAddress', 'service', 'ipAddress', 'timestamp'];
}
