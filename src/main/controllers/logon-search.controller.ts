import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import autobind from 'autobind-decorator';
import config from 'config';
import {AppRequest, FormError} from '../models/appRequest';
import {Response} from 'express';
import {LogonSearchRequest} from '../models/idam/LogonSearchRequest';
import {
  atLeastOneFieldIsFilled,
  fillPartialTimestamp,
  isFilledIn,
  startDateBeforeEndDate,
  validDateInput,
} from '../util/validators';
import {formDateToRequestDate} from '../util/Date';
import {LogonController} from './logon.controller';

/**
 * Search Controller class to handle search tab functionality
 */
@autobind
export class LogonSearchController {
  private logger: LoggerInstance = Logger.getLogger('SearchController');

  private pageSize: number = config.get('pagination.maxRecords');

  private logonsController = new LogonController();
  private errors: FormError[] = [];

  /**
   * Returns the array containing the list of Form Errors, empty array if none.
   */
  public getErrors(): FormError[] {
    return this.errors;
  }

  /**
   * Reset the errors array to an empty array.
   *
   * @private
   */
  private resetErrors(): void {
    this.errors = [];
  }

  /**
   * Adds any form error returned by the validator to the form error array.
   *
   * @param id ID of the field (or form if multiple fields)
   * @param fields The field(s) being validated
   * @param validator The validator function
   * @param errorType Optional - Override the errorType returned by the validator function
   * @private
   */
  private validate(
    id: string,
    fields: Partial<LogonSearchRequest> | string,
    validator: (f: Partial<LogonSearchRequest> | string) => string,
    errorType?: string,
  ): void {
    const error = validator(fields);
    if (error) this.errors.push({propertyName: id, errorType: errorType || error});
  }

  /**
   * Function to run through the validation for the search form.
   *
   * @param form Search form to validate. Contains a partial of the search request object.
   */
  public validateSearchForm(form: Partial<LogonSearchRequest>): FormError[] {
    this.resetErrors();

    // At least one of the string form inputs
    this.validate(
      'logonSearchForm',
      {
        userId: form.userId,
        emailAddress: form.emailAddress,
      },
      atLeastOneFieldIsFilled,
      'stringFieldRequired',
    );

    // startTimestamp is filled in and correctly formatted
    form.startTimestamp = fillPartialTimestamp(form.startTimestamp);
    this.validate('startTimestamp', form.startTimestamp, isFilledIn);
    this.validate('startTimestamp', form.startTimestamp, validDateInput);

    // endTimestamp is filled in and correctly formatted
    form.endTimestamp = fillPartialTimestamp(form.endTimestamp);
    this.validate('endTimestamp', form.endTimestamp, isFilledIn);
    this.validate('endTimestamp', form.endTimestamp, validDateInput);

    // Start date is before end date
    this.validate('logonSearchForm', {
      startTimestamp: form.startTimestamp,
      endTimestamp: form.endTimestamp,
    }, startDateBeforeEndDate);

    return this.getErrors();
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
      res.redirect('/');
    }
  }

  private formatSearchRequest(request: Partial<LogonSearchRequest>) {
    // Remove any properties with empty strings from the request object
    // @ts-ignore
    Object.keys(request).forEach(key => request[key] === '' ? delete request[key] : {});

    if (request.page) {
      request.page = Number(request.page);
    }

    if (request.startTimestamp) {
      request.startTimestamp = formDateToRequestDate(request.startTimestamp);
    }

    if (request.endTimestamp) {
      request.endTimestamp = formDateToRequestDate(request.endTimestamp);
    }
  }

}
