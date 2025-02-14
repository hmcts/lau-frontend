import {BaseService} from './BaseService';
import config from 'config';
import {ErrorCode} from '../models/AppError';
import {AppRequest} from '../models/appRequest';

import {CaseChallengedAccessRequest} from '../models/challenged-access/CaseChallengedAccessRequest';
import {CaseChallengedAccesses} from '../models/challenged-access/CaseChallengedAccesses';
import logger from '../modules/logging';

export class challengedAccessService extends BaseService<CaseChallengedAccessRequest> {
  baseApiUrl = String(config.get('services.lau-case-backend.url'));
  errorCode = ErrorCode.CASE_BACKEND;

  public getChallengedAccess(req: AppRequest, csv = false): Promise<CaseChallengedAccesses> {
    const endpoint: string = config.get('services.lau-case-backend.endpoints.caseAccess');
    // Shallow clone state to prevent modifications to search params for csv case do not persist in session
    const searchParameters = {...req.session.caseChallengedAccessFormState};
    if (csv) {
      searchParameters.page = 1;
      searchParameters.size = req.session.challengedAccessData?.totalNumberOfRecords || 0;
    }
    logger.info('getChallengedAccess: ' + JSON.stringify(searchParameters) + ' CSV: ' + csv);
    return this.get(req.session, endpoint, this.getQueryString(searchParameters)) as Promise<CaseChallengedAccesses>;
  }
}
