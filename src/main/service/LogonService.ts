import {BaseService} from './BaseService';

import config from 'config';
import {LogonAudit} from '../models/idam/LogonAudit';
import {LogonSearchRequest} from '../models/idam/LogonSearchRequest';
import {AppRequest} from '../models/appRequest';
import {LauServiceName} from './AuthService';

export class LogonService extends BaseService<LogonSearchRequest> {
  baseApiUrl = String(config.get('services.idam-backend.url'));
  serviceName: LauServiceName = 'lau_frontend';

  public getLogons(req: AppRequest, csv?: boolean): Promise<LogonAudit> {
    const endpoint: string = config.get('services.idam-backend.endpoints.logon');
    const searchParameters = req.session.logonFormState || {};
    if (csv) {
      searchParameters.page = 1;
      searchParameters.size = req.session.logons?.totalNumberOfRecords || 0;
    }
    return this.get(req.session.user, endpoint, this.getQueryString(searchParameters)) as Promise<LogonAudit>;
  }
}
