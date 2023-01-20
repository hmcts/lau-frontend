import {Logs} from '../Logs';

export interface LogonLog {
  userId: string;
  emailAddress: string;
  loginState: string;
  service: string;
  ipAddress: string;
  timestamp: string;
}

export class LogonLogs extends Logs<LogonLog> {
  public _fields: string[] = ['userId', 'emailAddress', 'loginState', 'service', 'ipAddress', 'timestamp'];
}

export const logonLogsOrder = ['userId', 'emailAddress', 'loginState', 'service', 'ipAddress', 'timestamp'];
