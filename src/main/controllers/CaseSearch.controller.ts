import autobind from 'autobind-decorator';
import {AppRequest} from '../models/appRequest';
import {Response} from 'express';
import {CaseSearchRequest} from '../models/case/CaseSearchRequest';
import {CaseActivityController} from './CaseActivity.controller';
import {CaseSearchesController} from './CaseSearches.controller';
import {BaseSearchController} from './BaseSearchController';
import {validCaseRef} from '../util/validators';
import {AppError, ErrorCode, errorRedirect} from '../models/AppError';

/**
 * Search Controller class to handle search tab functionality
 */
@autobind
export class CaseSearchController extends BaseSearchController<CaseSearchRequest> {
  private caseActivityController = new CaseActivityController();
  private caseSearchesController = new CaseSearchesController();

  formId = 'caseSearchForm';
  requiredFields = [
    'caseTypeId', 'caseJurisdictionId', 'caseRef', 'userId',
  ];

  override additionalValidation(form: Partial<CaseSearchRequest>): void {
    this.validate('caseRef', form.caseRef, validCaseRef);
  }

  /**
   * POST function for Search Controller
   *
   * @param req AppRequest - extension of Express Request
   * @param res Express Response
   */
  public async post(req: AppRequest, res: Response): Promise<void> {
    const searchRequest: Partial<CaseSearchRequest> = req.body;
    req.session.caseFormState = searchRequest;
    req.session.errors = this.validateSearchForm(searchRequest);

    if (this.getErrors().length === 0) {
      searchRequest.size = this.pageSize;

      // To be sent to API GET
      this.logger.info('API Request Parameters: ', searchRequest);

      this.formatSearchRequest(searchRequest);

      await Promise.all([
        this.caseActivityController.getLogData(req),
        this.caseSearchesController.getLogData(req),
      ]).then(value => {
        this.logger.info('Case search promise complete... updating session and redirecting...');
        req.session.caseActivities = value[0];
        req.session.caseSearches = value[1];
        res.redirect('/#case-activity-tab');
      }).catch((err: AppError) => {
        this.logger.error(err.message);
        errorRedirect(res, err.code || ErrorCode.FRONTEND);
      });
    } else {
      res.redirect('/');
    }
  }

}
