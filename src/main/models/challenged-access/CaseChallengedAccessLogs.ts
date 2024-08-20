import {Logs} from '../Logs';

export interface CaseChallengedAccessLog {
  requestType: string;
  caseId: string;
  caseRef: string;
  userId: string;
  action: string;
  requestStart: string;
  requestEnd: string;
  reason: string;
  timestamp: string;
}

export const caseChallengedAccessLogOrder = ['caseRef', 'userId', 'requestType', 'action', 'reason', 'requestStartTimestamp', 'requestEndTimestamp', 'timestamp'];

export const textMapping: { [key: string]: string } = {
  caseRef: 'Case Ref',
  userId: 'User ID',
  requestType: 'Type',
  action: 'Operation',
  reason: 'Explanation',
  requestStartTimestamp: 'Request Start',
  requestEndTimestamp: 'Request End',
  timestamp: 'Timestamp (UTC)',
};

export function getCaseChallengedAccessLogOrder(): { text: string }[]  {
  return caseChallengedAccessLogOrder.map(key => ({ text: textMapping[key] }));
}

export class CaseChallengedAccessLogs extends Logs<CaseChallengedAccessLog> {
  public _fields: string[] = caseChallengedAccessLogOrder;
}
