import {Logs} from '../Logs';

export interface CaseChallengedAccessLog {
  requestType: string;
  caseId: string;
  caseRef: string;
  userId: string;
  action: string;
  requestEnd: string;
  reason: string;
  timestamp: string;
}

export const caseChallengedAccessLogOrder = ['userId', 'caseRef', 'requestType', 'action', 'timestamp','reason','requestEndTimestamp'];

export const textMapping: { [key: string]: string } = {
  userId: 'User ID',
  caseRef: 'Case ID',
  requestType: 'Request Type',
  action: 'Action',
  timestamp: 'Action On (UTC)',
  reason: 'Justification',
  requestEndTimestamp: 'Time Limit (UTC)',
};

export function getCaseChallengedAccessLogOrder(): { text: string }[]  {
  return caseChallengedAccessLogOrder.map(key => ({ text: textMapping[key] }));
}

export class CaseChallengedAccessLogs extends Logs<CaseChallengedAccessLog> {
  public _fields: string[] = caseChallengedAccessLogOrder;
}
