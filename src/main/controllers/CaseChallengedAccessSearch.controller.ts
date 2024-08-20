import autobind from 'autobind-decorator';
import {AppRequest} from '../models/appRequest';
import {Response} from 'express';
import {CaseChallengedAccessRequest} from '../models/challenged-access/CaseChallengedAccessRequest';
import {BaseSearchController} from './BaseSearchController';
import {validCaseRef} from '../util/validators';
import {AppError, ErrorCode, errorRedirect} from '../models/AppError';
import {CaseChallengedAccessController} from './CaseChallengedAccess.controller';

/**
 * Search Controller class to handle search tab functionality
 */
@autobind
export class CaseChallengedAccessSearchController extends BaseSearchController<CaseChallengedAccessRequest> {
  private caseChallengedAccessController = new CaseChallengedAccessController();

  formId = 'caseChallengedAccessSearchForm';
  requiredFields = [
    'caseRef','userId',
  ];

  override additionalValidation(form: Partial<CaseChallengedAccessRequest>): void {
    this.validate('caseRef', form.caseRef, validCaseRef);
  }

  /**
   * POST function for Search Controller
   *
   * @param req AppRequest - extension of Express Request
   * @param res Express Response
   */
  public async post(req: AppRequest, res: Response): Promise<void> {
    const searchRequest: Partial<CaseChallengedAccessRequest> = req.body;

    if (searchRequest.requestType === 'ALL') {
      delete searchRequest.requestType;
    }
    req.session.caseChallengedAccessFormState = searchRequest;
    req.session.errors = this.validateSearchForm(searchRequest);
    req.session.fromPost = true;
    if (this.getErrors().length === 0) {
      searchRequest.size = this.pageSize;

      // To be sent to API GET
      this.logger.info('API Request Parameters: ', searchRequest);

      this.formatSearchRequest(searchRequest);

      return this.caseChallengedAccessController.getLogData(req).then(logData => {
        this.logger.info('Case search promise complete... updating session and redirecting...');
        req.session.challengedAccessData = logData;
        res.redirect('/challenged-specific-access');
      }).catch((err: AppError) => {
        this.logger.error(err.message);
        errorRedirect(res, err.code || ErrorCode.FRONTEND);
      });
    } else {
      res.redirect('/challenged-specific-access');
    }
  }

}
