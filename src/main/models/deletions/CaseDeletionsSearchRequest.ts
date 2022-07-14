export enum DeletionModes {'ALL' = 'ALL', 'DELETE' = 'DELETE', 'SIMULATE' = 'SIMULATE'}

export interface CaseDeletionsSearchRequest {
  caseJurisdictionId: string;
  deletionMode: DeletionModes;
  startTimestamp: string;
  endTimestamp: string;
  size: number;
  page: number;
}
