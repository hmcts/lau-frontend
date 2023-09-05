import {BaseSearchController} from './BaseSearchController';

import autobind from 'autobind-decorator';
import {AppRequest} from '../models/appRequest';
import {Response} from 'express';
import {AppError, ErrorCode, errorRedirect} from '../models/AppError';
import {DeletedUsersSearchRequest} from '../models/user-deletions/DeletedUsersSearchRequest';
import {DeletedUsers} from './DeletedUsers.controller';

/**
 * Search Controller class to handle search tab functionality
 */
@autobind
export class DeletedUsersSearchController extends BaseSearchController<DeletedUsersSearchRequest> {
  private deletedUsers = new DeletedUsers();

  formId = 'deletedUsersSearchForm';
  requiredFields = [
    'userId', 'emailAddress', 'firstName', 'lastName',
  ];

  /**
   * POST function for Search Controller
   *
   * @param req AppRequest - extension of Express Request
   * @param res Express Response
   */
  public async post(req: AppRequest, res: Response): Promise<void> {
    const searchRequest: Partial<DeletedUsersSearchRequest> = req.body;
    req.session.deletedUsersFormState = searchRequest;
    req.session.errors = this.validateSearchForm(searchRequest);

    if (this.getErrors().length === 0) {
      searchRequest.size = this.pageSize;

      // To be sent to API GET
      this.logger.info('API Request Parameters: ', searchRequest);

      this.formatSearchRequest(searchRequest);

      return this.deletedUsers.getDeletedUsersData(req).then(logData => {
        req.session.logons = logData;
        res.redirect('/#deleted-users-tab');
      }).catch((err: AppError) => {
        this.logger.error(err.message);
        errorRedirect(res, err.code || ErrorCode.FRONTEND);
      });
    } else {
      res.redirect('/#deleted-users-search-tab');
    }
  }
}
