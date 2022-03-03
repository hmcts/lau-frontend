import {BaseService} from './BaseService';

import config from 'config';
import {CaseActivityAudit} from '../models/case/CaseActivityAudit';
import {CaseSearchRequest} from '../models/case/CaseSearchRequest';
import {CaseSearchAudit} from '../models/case/CaseSearchAudit';
import {AppRequest} from '../models/appRequest';

export class CaseService extends BaseService<CaseSearchRequest> {
  baseApiUrl = String(config.get('services.lau-case-backend.url'));

  public getCaseActivities(req: AppRequest, csv = false): Promise<CaseActivityAudit> {
    const endpoint: string = config.get('services.lau-case-backend.endpoints.caseActivity');
    // Shallow clone state to prevent modifications to search params for csv case do not persist in session
    const searchParameters = Object.assign({}, req.session.caseFormState) || {};
    if (csv) {
      searchParameters.page = 1;
      searchParameters.size = req.session.caseActivities?.totalNumberOfRecords || 0;
    }
    this.logger.info('getCaseActivities: ' + JSON.stringify(searchParameters) + ' CSV: ' + csv);
    return this.get(req.session, endpoint, this.getQueryString(searchParameters)) as Promise<CaseActivityAudit>;
  }

  public getCaseSearches(req: AppRequest, csv = false): Promise<CaseSearchAudit> {
    const endpoint: string = config.get('services.lau-case-backend.endpoints.caseSearch');
    // Shallow clone state to prevent modifications to search params for csv case do not persist in session
    const searchParameters = Object.assign({}, req.session.caseFormState) || {};
    if (csv) {
      searchParameters.page = 1;
      searchParameters.size = req.session.caseSearches?.totalNumberOfRecords || 0;
    }
    this.logger.info('getCaseSearches: ' + JSON.stringify(searchParameters) + ' CSV: ' + csv);
    return this.get(req.session, endpoint, this.getQueryString(searchParameters)) as Promise<CaseSearchAudit>;
  }
}
