import config from 'config';
import {BaseService} from './BaseService';
import {ErrorCode} from '../models/AppError';
import {AppRequest} from '../models/appRequest';
import {UserDetailsAuditData} from '../models/user-details/UserDetailsAuditData';
import {UserDetailsSearchRequest} from '../models/user-details/UserDetailsSearchRequest';
import logger from '../modules/logging';


export class UserDetailsService extends BaseService<UserDetailsSearchRequest> {
  baseApiUrl = String(config.get('services.lau-eud-backend.url'));
  errorCode = ErrorCode.EUD_BACKEND;

  public getUserDetails(req: AppRequest<UserDetailsSearchRequest>, isEmail: boolean): Promise<UserDetailsAuditData> {
    const endpoint: string = config.get('services.lau-eud-backend.endpoints.userDetails');
    const userIdOrEmail = req.session.userDetailsFormState.userIdOrEmail;
    logger.info(`Calling userDetails for user ${userIdOrEmail}`);
    const queryParam = isEmail? 'email': 'userId';
    return this.get(req.session, `${endpoint}?${queryParam}=${userIdOrEmail}`) as Promise<UserDetailsAuditData>;
  }
}
