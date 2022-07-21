export interface CaseDeletionsSearchRequest {
  caseRef: string;
  caseTypeId: string;
  caseJurisdictionId: string;
  startTimestamp: string;
  endTimestamp: string;
  size: number;
  page: number;
}
