import fs from 'node:fs';
import fetch from 'node-fetch';
import {AuthService, IdamGrantType, IdamRequestExtraParams, IdamResponseData} from './AuthService';
import { IConfig } from 'config';

import {Logger} from '@hmcts/nodejs-logging';
import {AppError, ErrorCode} from '../models/AppError';
import path from 'path';

interface JurisdictionsCaseTypes {
  jurisdictions: {text: string, value: string}[];
  caseTypes: {text: string, value: string}[];
}

const resourcesDirectory = path.join(__dirname, '../resources');

export class AutoSuggestService {

  private dataFile = path.join(resourcesDirectory, 'data/jurisdictions_case_types.json');
  private staticData: JurisdictionsCaseTypes;
  private logger = Logger.getLogger(this.constructor.name);
  private readonly dataUrl: string;
  private readonly serviceName: string;
  private readonly dataEndpoint: string;

  constructor(private authService: AuthService, config: IConfig) {
    this.staticData = {jurisdictions: [], caseTypes: []};
    this.dataUrl = config.get('services.lau-case-backend.url');
    this.dataEndpoint = config.get('services.lau-case-backend.endpoints.jurisdictionsCaseTypes');
  }

  public loadData(devMode: boolean): void {
    if (devMode) {
      fs.readFile(this.dataFile, (err, data) => {
        if (err) {
          this.logger.error(err);
          return;
        }
        this.staticData = JSON.parse(data.toString('utf8'));
      });
    } else {
      this.logger.info('Loading type-ahead data...');
      this.fetchData().then((data: JurisdictionsCaseTypes) => {
        this.staticData = data;
        this.logger.info('Data loaded successfully');
      }).catch((err: Error) => {
        this.logger.error(err);
        throw new AppError(err.message, ErrorCode.DATA);
      });
    }
  }

  private async fetchData(): Promise<JurisdictionsCaseTypes> {
    // const extraParams: IdamRequestExtraParams = {
    //   'scope': 'openid profile roles',
    //   'username': this.username,
    //   'password': this.password,
    // };
    // const [idamResponse, s2sToken] = await Promise.all([
    //   this.authService.getIdAMResponse(IdamGrantType.PASSWORD, extraParams),
    //   this.authService.retrieveServiceToken(this.serviceName),
    // ]);
    // const idamData: IdamResponseData = await idamResponse.json();

    const response = await fetch(`${this.dataUrl}${ this.dataEndpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ServiceAuthorization': 's2sToken.bearerToken',
        'Authorization': 'Bearer ${idamData.access_token}',
      },
    });
    const data = await response.json();
    return this.parseLauCaseData(data);
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

  private parseLauCaseData(data: {jurisdictions: string[], caseTypes: string[]}):JurisdictionsCaseTypes {
    return {
      'jurisdictions': data.jurisdictions.map(jurisdiction => ({'text': jurisdiction, 'value': jurisdiction})),
      'caseTypes': data.caseTypes.map(caseType => ({'text': caseType, 'value': caseType})),
    };
  }

  private convertSetToArray(data: Set<string>): {text: string, value: string}[] {
    return Array.from(data).map(item => ({'text': item, 'value': item}));
  }
}
