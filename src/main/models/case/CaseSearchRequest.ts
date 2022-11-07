export interface CaseSearchRequest {
  userId: string;
  caseRef: string;
  caseTypeId: string;
  caseJurisdictionId: string;
  caseAction: string;
  startTimestamp: string;
  endTimestamp: string;
  size: number;
  page: number;
}
