import {BaseService} from './BaseService';

import config from 'config';
import {AppRequest} from '../models/appRequest';
import {ErrorCode} from '../models/AppError';
import {CaseDeletionsSearchRequest} from '../models/deletions/CaseDeletionsSearchRequest';
import {CaseDeletions} from '../models/deletions/CaseDeletions';

export class CaseDeletionsService extends BaseService<CaseDeletionsSearchRequest> {
  baseApiUrl = String(config.get('services.lau-case-backend.url'));
  errorCode = ErrorCode.CASE_BACKEND;

  public getCaseDeletions(req: AppRequest, csv = false): Promise<CaseDeletions> {
    const endpoint: string = config.get('services.lau-case-backend.endpoints.caseDeletions');
    // Shallow clone state to prevent modifications to search params for csv case do not persist in session
    const searchParameters = Object.assign({}, req.session.caseDeletionsFormState) || {};
    if (csv) {
      searchParameters.page = 1;
      searchParameters.size = req.session.caseDeletions?.totalNumberOfRecords || 0;
    }
    this.logger.info('getCaseDeletions: ' + JSON.stringify(searchParameters) + ' CSV: ' + csv);
    return this.get(req.session, endpoint, this.getQueryString(searchParameters)) as Promise<CaseDeletions>;
  }
}
