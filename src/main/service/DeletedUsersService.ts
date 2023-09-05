import {BaseService} from './BaseService';
import config from 'config';
import {ErrorCode} from '../models/AppError';
import {AppRequest} from '../models/appRequest';
import {DeletedUsersSearchRequest} from '../models/user-deletions/DeletedUsersSearchRequest';
import {DeletedUsersAudit} from '../models/user-deletions/DeletedUsersAudit';

export class DeletedUsersService extends BaseService<DeletedUsersSearchRequest> {
    baseApiUrl = String(config.get('services.lau-idam-backend.url'));
    errorCode = ErrorCode.IDAM_BACKEND;

    public getDeletedUsers(req: AppRequest, csv = false): Promise<DeletedUsersAudit> {
      const endpoint: string = config.get('services.lau-idam-backend.endpoints.deletedUsers');
      // Shallow clone state to prevent modifications to search params for csv case do not persist in session
      const searchParameters = Object.assign({}, req.session.deletedUsersFormState) || {};
      if (csv) {
        searchParameters.page = 1;
        searchParameters.size = req.session.logons?.totalNumberOfRecords || 0;
      }
      this.logger.info('getDeletedUsers: ' + JSON.stringify(searchParameters) + ' CSV: ' + csv);
      return this.get(req.session, endpoint, this.getQueryString(searchParameters)) as Promise<DeletedUsersAudit>;
    }
}