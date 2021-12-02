import autobind from 'autobind-decorator';
import {AppRequest} from '../models/appRequest';
import {Response} from 'express';
import {CaseSearchRequest} from '../models/case/CaseSearchRequest';
import {CaseActivityController} from './CaseActivity.controller';
import {CaseSearchesController} from './CaseSearches.controller';
import {BaseSearchController} from './BaseSearchController';

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
        req.session.caseActivities = value[0];
        req.session.caseSearches = value[1];
        res.redirect('/#case-activity-tab');
      }).catch(err => {
        this.logger.error(err);
        res.redirect('/error');
      });
    } else {
      res.redirect('/');
    }
  }

}
