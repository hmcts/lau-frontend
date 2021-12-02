import {BaseService} from './BaseService';

import config from 'config';
import {LogonAudit} from '../models/idam/LogonAudit';
import {LogonSearchRequest} from '../models/idam/LogonSearchRequest';
import {AppRequest} from '../models/appRequest';

export class LogonService extends BaseService<LogonSearchRequest> {
  baseApiUrl = String(config.get('services.idam-backend.url'));

  public getLogons(req: AppRequest): Promise<LogonAudit> {
    const endpoint: string = config.get('services.idam-backend.endpoints.logon');
    const searchParameters = req.session.logonFormState || {};
    return this.get(req.session.user, endpoint, this.getQueryString(searchParameters)) as Promise<LogonAudit>;
  }
}
