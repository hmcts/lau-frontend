export interface CaseDeletionsSearchRequest {
  caseRef: string;
  caseTypeId: string;
  caseJurisdictionId: string;
  caseAction: string;
  startTimestamp: string;
  endTimestamp: string;
  size: number;
  page: number;
}
