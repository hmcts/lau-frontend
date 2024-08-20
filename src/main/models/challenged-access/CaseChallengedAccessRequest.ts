export interface CaseChallengedAccessRequest {
  userId: string;
  caseRef: string;
  requestType: string;
  startTimestamp: string;
  endTimestamp: string;
  size: number;
  page: number;
}
