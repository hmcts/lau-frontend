export interface AutoSuggestService {

  loadData(): void;

  getJurisdictionsData?(): { text: string, value: string }[];

  getCaseTypesData?(): { text: string, value: string }[]
}
