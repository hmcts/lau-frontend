import fs from 'node:fs';
import {IConfig} from 'config';

import {Logger} from '@hmcts/nodejs-logging';
import path from 'path';
import {AutoSuggestService} from '../modules/autosuggest/AutoSuggestService';
import autobind from 'autobind-decorator';

interface JurisdictionsCaseTypes {
  jurisdictions: {text: string, value: string}[];
  caseTypes: {text: string, value: string}[];
}

interface JurisdictionCaseTypePair {
  jurisdiction: string;
  caseType: string;
}

const resourcesDirectory = path.join(__dirname, '../resources');

@autobind
export class CaseTypeJurisdictionAutoSuggest implements AutoSuggestService {

  private readonly dataFile: string;
  private staticData: JurisdictionsCaseTypes;
  private logger = Logger.getLogger(this.constructor.name);

  constructor(config: IConfig) {
    this.staticData = {jurisdictions: [], caseTypes: []};
    this.dataFile = config.get('is_dev') === true ? 'data/auto-suggest-data-dev.json': 'data/auto-suggest-data-prod.json';
    this.logger.info('is_dev: ' + config.get('is_dev'));
    this.logger.info('CaseType Jurisdiction Data file loaded: ' + this.dataFile);
  }

  public loadData(): void {
    const fullDataPath = path.join(resourcesDirectory, this.dataFile);
    fs.readFile(fullDataPath, (err, data) => {
      if (err) {
        this.logger.error(err);
        return;
      }
      this.staticData = this.parseDataFile(JSON.parse(data.toString('utf8')));
    });
  }

  public getJurisdictionsData(): {text: string, value: string}[] {
    return [
      {'text':'', 'value': ''},
      ...this.staticData.jurisdictions,
    ];
  }

  public getCaseTypesData(): {text: string, value: string}[] {
    return [
      {'text': '', 'value': ''},
      ...this.staticData.caseTypes,
    ];
  }

  private parseDataFile(data: JurisdictionCaseTypePair[]): JurisdictionsCaseTypes {
    const jurisdictions = new Set<string>();
    const caseTypes = new Set<string>();
    data.forEach(pair => {
      jurisdictions.add(pair.jurisdiction);
      caseTypes.add(pair.caseType);
    });
    return {
      'jurisdictions': this.convertSetToArray(jurisdictions),
      'caseTypes': this.convertSetToArray(caseTypes),
    };
  }

  private convertSetToArray(data: Set<string>): {text: string, value: string}[] {
    return Array.from(data).map(item => ({'text': item, 'value': item}));
  }
}
