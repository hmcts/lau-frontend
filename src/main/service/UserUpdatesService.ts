import config from 'config';
import {BaseService} from './BaseService';
import {ErrorCode} from '../models/AppError';
import {AppSession} from '../models/appRequest';
import {UserUpdatesAuditData, UserUpdatesAuditDataResponse} from '../models/user-details/UserDetailsAuditData';

export interface UserUpdatesSearchRequest {
  userId: string;
  size?: number;
}

export class UserUpdatesService extends BaseService<UserUpdatesSearchRequest> {
  baseApiUrl = String(config.get('services.lau-eud-backend.url'));
  userUpdatesEndpoint = String(config.get('services.lau-eud-backend.endpoints.userAccountUpdates'));
  pageSize = Number(config.get('pagination.maxPerPage'));
  errorCode = ErrorCode.EUD_BACKEND;

  public async getUserUpdates(session: AppSession, userId: string): Promise<UserUpdatesAuditData[]> {
    const qs = this.getQueryString({ userId, size: this.pageSize });
    const updatesResponse = await this.get(session, this.userUpdatesEndpoint, qs) as UserUpdatesAuditDataResponse;
    // TODO there is a potential for more than one page though unlikely anyone would go over 100 updates
    return updatesResponse.content;
  }
}
