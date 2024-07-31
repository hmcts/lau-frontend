import {Express} from 'express';

import {AutoSuggestService} from './AutoSuggestService';
import autobind from 'autobind-decorator';


@autobind
export class AutoSuggest {

  private autoSuggestService: AutoSuggestService;

  constructor(autoSuggestService: AutoSuggestService) {
    this.autoSuggestService = autoSuggestService;
    this.autoSuggestService.loadData();
  }

  public enableFor(app: Express): void {

    app.use((req, res, next) => {
      res.locals.jurisdictions = this.autoSuggestService.getJurisdictionsData();
      res.locals.caseTypes = this.autoSuggestService.getCaseTypesData();
      next();
    });
  }
}


