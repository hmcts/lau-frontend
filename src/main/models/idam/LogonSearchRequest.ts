export interface LogonSearchRequest {
  userId: string;
  emailAddress: string;
  startTimestamp: string;
  endTimestamp: string;
  size: number;
  page: number;
}
