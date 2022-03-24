import {BaseService} from './BaseService';

import config from 'config';
import {LogonAudit} from '../models/idam/LogonAudit';
import {LogonSearchRequest} from '../models/idam/LogonSearchRequest';
import {AppRequest} from '../models/appRequest';
import {ErrorCode} from '../models/AppError';

export class LogonService extends BaseService<LogonSearchRequest> {
  baseApiUrl = String(config.get('services.lau-idam-backend.url'));
  errorCode = ErrorCode.IDAM_BACKEND;

  public getLogons(req: AppRequest, csv = false): Promise<LogonAudit> {
    const endpoint: string = config.get('services.lau-idam-backend.endpoints.logon');
    // Shallow clone state to prevent modifications to search params for csv case do not persist in session
    const searchParameters = Object.assign({}, req.session.logonFormState) || {};
    if (csv) {
      searchParameters.page = 1;
      searchParameters.size = req.session.logons?.totalNumberOfRecords || 0;
    }
    this.logger.info('getLogons: ' + JSON.stringify(searchParameters) + ' CSV: ' + csv);
    return this.get(req.session, endpoint, this.getQueryString(searchParameters)) as Promise<LogonAudit>;
  }
}
