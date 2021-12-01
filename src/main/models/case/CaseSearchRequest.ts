export interface CaseSearchRequest {
  userId: string;
  caseRef: string;
  caseTypeId: string;
  caseJurisdictionId: string;
  startTimestamp: string;
  endTimestamp: string;
  size: number;
  page: number;
}
