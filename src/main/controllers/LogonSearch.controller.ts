import {BaseSearchController} from './BaseSearchController';

import autobind from 'autobind-decorator';
import {AppRequest} from '../models/appRequest';
import {Response} from 'express';
import {LogonSearchRequest} from '../models/idam/LogonSearchRequest';
import {LogonController} from './Logon.controller';
import {AppError, ErrorCode, errorRedirect} from '../models/AppError';
import {validEmail} from '../util/validators';
import logger from '../modules/logging';

/**
 * Search Controller class to handle search tab functionality
 */
@autobind
export class LogonSearchController extends BaseSearchController<LogonSearchRequest> {
  private logonsController = new LogonController();

  formId = 'logonSearchForm';
  requiredFields = [
    'userId', 'emailAddress',
  ];

  override additionalValidation(form: Partial<LogonSearchRequest>): void {
    this.validate('emailAddress', form.emailAddress, validEmail);
  }

  /**
   * POST function for Search Controller
   *
   * @param req AppRequest - extension of Express Request
   * @param res Express Response
   */
  public async post(req: AppRequest, res: Response): Promise<void> {
    const searchRequest: Partial<LogonSearchRequest> = req.body;
    req.session.logonFormState = searchRequest;
    req.session.errors = this.validateSearchForm(searchRequest);
    req.session.fromPost = true;

    if (this.getErrors().length === 0) {
      searchRequest.size = this.pageSize;

      // To be sent to API GET
      logger.info('API Request Parameters: ', searchRequest);

      this.formatSearchRequest(searchRequest);

      return this.logonsController.getLogData(req).then(logData => {
        req.session.logons = logData;
        res.redirect('/logon-audit#results-section');
      }).catch((err: AppError) => {
        logger.error(err.message);
        errorRedirect(res, err.code || ErrorCode.FRONTEND);
      });
    } else {
      res.redirect('/logon-audit');
    }
  }
}
