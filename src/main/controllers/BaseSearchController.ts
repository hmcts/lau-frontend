import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import config from 'config';
import {AppRequest, FormError} from '../models/appRequest';
import {Response} from 'express';
import {
  atLeastOneFieldIsFilled,
  fillPartialTimestamp,
  isFilledIn,
  startDateBeforeEndDate,
  validDateInput,
  validUtcDateAndTime
} from '../util/validators';
import {formDateToRequestDate} from '../util/Date';

interface SearchTypeCommon {
  startTimestamp: string;
  endTimestamp: string;
  page: number;
}

/**
 * Base Search Controller class containing common functionality for the search controllers
 */
export abstract class BaseSearchController<SearchType extends SearchTypeCommon> {
  abstract formId: string;
  abstract requiredFields: string[];

  logger: LoggerInstance = Logger.getLogger(this.constructor.name);
  pageSize: number = config.get('pagination.maxPerPage');

  private errors: FormError[] = [];

  /**
   * Returns the array containing the list of Form Errors, empty array if none.
   */
  getErrors(): FormError[] {
    return this.errors;
  }

  /**
   * Reset the errors array to an empty array.
   */
  resetErrors(): void {
    this.errors = [];
  }

  /**
   * Adds any form error returned by the validator to the form error array.
   *
   * @param id ID of the field (or form if multiple fields)
   * @param fields The field(s) being validated
   * @param validator The validator function
   * @param errorType Optional - Override the errorType returned by the validator function
   */
  validate(
    id: string,
    fields: Partial<SearchType> | string,
    validator: (f: Partial<SearchType> | string) => string,
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
  public validateSearchForm(form: Partial<SearchType>): FormError[] {
    this.resetErrors();

    const requiredFieldsObj: Partial<SearchType> = {};
    this.requiredFields.forEach(field => {
      // @ts-ignore
      requiredFieldsObj[field] = form[field];
    });

    // At least one of the string form inputs
    this.validate(
      this.formId,
      requiredFieldsObj,
      // @ts-ignore
      atLeastOneFieldIsFilled,
      'stringFieldRequired',
    );

    // startTimestamp is filled in and correctly formatted
    form.startTimestamp = fillPartialTimestamp(form.startTimestamp);
    this.validate('startTimestamp', form.startTimestamp, isFilledIn);
    this.validate('startTimestamp', form.startTimestamp, validDateInput);

    // startTimestamp is in utc
    this.validate('startTimestamp', form.startTimestamp,validUtcDateAndTime);
    

    // endTimestamp is filled in and correctly formatted
    form.endTimestamp = fillPartialTimestamp(form.endTimestamp);
    this.validate('endTimestamp', form.endTimestamp, isFilledIn);
    this.validate('endTimestamp', form.endTimestamp, validDateInput);

    // endTimestamp is in utc
    this.validate('endTimestamp', form.endTimestamp,validUtcDateAndTime);

    // Start date is before end date
    // @ts-ignore
    this.validate(this.formId, {
      startTimestamp: form.startTimestamp,
      endTimestamp: form.endTimestamp,
    }, startDateBeforeEndDate);

    this.additionalValidation(form);

    return this.getErrors();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  additionalValidation(form: Partial<SearchType>): void {
    // To be overridden if child classes need additional validation
  }

  abstract post(req: AppRequest, res: Response): Promise<void>;

  formatSearchRequest(request: Partial<SearchType>): void {
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
