import fs from 'node:fs';
import {AuthService, IdamGrantType, IdamRequestExtraParams, IdamResponseData} from './AuthService';

import {Logger} from '@hmcts/nodejs-logging';

interface JurisdictionsCaseTypes {
  jurisdictions: {text: string, value: string}[];
  caseTypes: {text: string, value: string}[];
}

export class DataService {

  private static instance: DataService;
  private authService: AuthService;

  staticData: JurisdictionsCaseTypes;
  logger = Logger.getLogger(this.constructor.name);

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private constructor(authService?: AuthService) {
    this.authService = authService || new AuthService();
    this.staticData = {jurisdictions: [], caseTypes: []};
  }

  public loadData(filePath: string): void {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        this.logger.error(err);
        return;
      }
      this.staticData = JSON.parse(data);
    });
  }

  public async downloadData(dataUrl: string, username: string, password: string, filePath: string) {
    const extraParams: IdamRequestExtraParams = {
      'scope': 'openid profile roles',
      'username': username,
      'password': password,
    };

    const idamResponse = await this.authService.getIdAMResponse(IdamGrantType.PASSWORD, extraParams);
    const idamData: IdamResponseData = await idamResponse.json();
    const s2sToken = await this.authService.retrieveServiceToken('ccd_data');

    const response = await fetch(dataUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ServiceAuthorization': s2sToken.bearerToken,
        'Authorization': `Bearer ${idamData.access_token}`,
      },
    });

    const data = this.parseCcdDataDefinitionsResponse(await response.json());

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  private parseCcdDataDefinitionsResponse(data: { id: string; case_types: { id: string }[] }[]): JurisdictionsCaseTypes {
    const jurisdictions = new Set<string>();
    const caseTypes = new Set<string>();
    data.forEach((item: { id: string; case_types: { id: string }[] }) => {
      jurisdictions.add(item.id);
      item['case_types'].forEach(caseType => {
        caseTypes.add(caseType.id);
      });
    });
    return {
      'jurisdictions': this.convertSetToArray(jurisdictions),
      'caseTypes': this.convertSetToArray(caseTypes),
    };
  }

  private convertSetToArray(data: Set<string>): {text: string, value: string}[] {
    return Array.from(data).map(item => ({'text': item, 'value': item}));
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
}
