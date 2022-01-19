import {BaseSearchController} from './BaseSearchController';

import autobind from 'autobind-decorator';
import {AppRequest} from '../models/appRequest';
import {Response} from 'express';
import {LogonSearchRequest} from '../models/idam/LogonSearchRequest';
import {LogonController} from './Logon.controller';

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

    if (this.getErrors().length === 0) {
      searchRequest.size = this.pageSize;

      // To be sent to API GET
      this.logger.info('API Request Parameters: ', searchRequest);

      this.formatSearchRequest(searchRequest);

      return this.logonsController.getLogData(req).then(logData => {
        req.session.logons = logData;
        res.redirect('/#logons-tab');
      }).catch(err => {
        this.logger.error(err);
        res.redirect('/error');
      });
    } else {
      res.redirect('/#logon-search-tab');
    }
  }
}
