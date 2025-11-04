import autobind from 'autobind-decorator';
import {AppRequest, FormError} from '../models/appRequest';
import {Response} from 'express';
import {validEmail} from '../util/validators';
import {UserDetailsService} from '../service/UserDetailsService';
import {AppError, errorRedirect} from '../models/AppError';
import logger from '../modules/logging';
import {formatAddress, formatStatus, NOT_AVAILABLE_MSG, UserDetailsSearchRequest} from '../models/user-details';
import {requestDateToFormDate} from '../util/Date';
import {mapOrElse} from '../util/Util';

@autobind
export class UserDetailsController {

  constructor(private readonly service = new UserDetailsService()) {};

  public async post(req: AppRequest<UserDetailsSearchRequest>, res: Response): Promise<void> {
    const searchRequest: UserDetailsSearchRequest = req.body;
    const userIdOrEmail = (searchRequest.userIdOrEmail ?? '').trim();
    req.session.userDetailsFormState = {...req.body, userIdOrEmail};
    req.session.fromPost = true;
    const errors = this.validateSearchForm(userIdOrEmail);
    req.session.errors = errors;
    if (errors.length > 0) {
      res.redirect('/user-details-audit');
      return;
    }

    try {
      const userDetails = await this.service.getUserDetails(req, this.isEmail(userIdOrEmail));
      req.session.userDetailsData = {
        ...userDetails,
        formattedAddresses: mapOrElse(userDetails.organisationalAddress, formatAddress, [NOT_AVAILABLE_MSG]),
        formattedAccCreationDate: requestDateToFormDate(userDetails.accountCreationDate, NOT_AVAILABLE_MSG),
        displayedStatus: formatStatus(userDetails.accountStatus, userDetails.recordType, NOT_AVAILABLE_MSG),
      };
      res.redirect('/user-details-audit#results-section');
      return;
    } catch (error) {
      const appErr = error as AppError;
      logger.error(appErr, {stack: (error as Error)?.stack});
      errorRedirect(res, appErr.code);
      return;
    }
  }

  private validateSearchForm(userIdOrEmail: string): FormError[] {
    const errors: FormError[] = [];
    if (!userIdOrEmail) {
      errors.push({propertyName: 'userIdOrEmail', errorType: 'required'});
    }
    return errors;
  }

  private isEmail(userIdOrEmail: string): boolean {
    const error = validEmail(userIdOrEmail);
    return !error;
  }
}
