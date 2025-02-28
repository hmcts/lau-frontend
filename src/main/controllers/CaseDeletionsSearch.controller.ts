import {BaseSearchController} from './BaseSearchController';

import autobind from 'autobind-decorator';
import {AppRequest} from '../models/appRequest';
import {Response} from 'express';
import {AppError, ErrorCode, errorRedirect} from '../models/AppError';
import {CaseDeletionsSearchRequest} from '../models/deletions/CaseDeletionsSearchRequest';
import {CaseDeletionsController} from './CaseDeletions.controller';
import {CaseActions} from '../models/case/CaseActivityLogs';
import logger from '../modules/logging';

/**
 * Search Controller class to handle search tab functionality
 */
@autobind
export class CaseDeletionsSearchController extends BaseSearchController<CaseDeletionsSearchRequest> {
  private caseDeletionsController = new CaseDeletionsController();

  formId = 'caseDeletionsSearchForm';
  requiredFields = [
    'caseRef', 'caseTypeId', 'caseJurisdictionId',
  ];

  /**
   * POST function for Search Controller
   *
   * @param req AppRequest - extension of Express Request
   * @param res Express Response
   */
  public async post(req: AppRequest, res: Response): Promise<void> {
    const searchRequest: Partial<CaseDeletionsSearchRequest> = req.body;
    searchRequest.caseAction = CaseActions.DELETE;
    req.session.caseDeletionsFormState = searchRequest;
    req.session.errors = this.validateSearchForm(searchRequest);
    req.session.fromPost = true;

    if (this.getErrors().length === 0) {
      searchRequest.size = this.pageSize;

      // To be sent to API GET
      logger.info('API Request Parameters: ', searchRequest);

      this.formatSearchRequest(searchRequest);

      return this.caseDeletionsController.getLogData(req).then(logData => {
        req.session.caseDeletions = logData;
        res.redirect('/case-deletion-audit#results-section');
      }).catch((err: AppError) => {
        logger.error(err.message);
        errorRedirect(res, err.code || ErrorCode.FRONTEND);
      });
    } else {
      res.redirect('/case-deletion-audit');
    }
  }
}
