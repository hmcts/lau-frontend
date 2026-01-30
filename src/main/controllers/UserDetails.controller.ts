import autobind from 'autobind-decorator';
import {AppRequest, FormError} from '../models/appRequest';
import {Response} from 'express';
import {validEmail} from '../util/validators';
import {UserDetailsService} from '../service/UserDetailsService';
import {AppError, errorRedirect} from '../models/AppError';
import logger from '../modules/logging';
import {
  formatAddress,
  formatStatus,
  GovukTableRow,
  mapEventName,
  NOT_AVAILABLE_MSG,
  UserDetailsSearchRequest,
  UserUpdatesAuditData,
} from '../models/user-details';
import {formatDate, requestDateToFormDate} from '../util/Date';
import {capitalize, mapOrElse} from '../util/Util';

@autobind
export class UserDetailsController {

  constructor(private readonly service = new UserDetailsService()) {};

  public async post(req: AppRequest<UserDetailsSearchRequest>, res: Response): Promise<void> {
    const searchRequest: UserDetailsSearchRequest = req.body;
    const userIdOrEmail = (searchRequest.userIdOrEmail ?? '').trim();
    req.session.userDetailsFormState = {...req.body, userIdOrEmail};
    req.session.fromPost = true;
    const isEmail = this.isEmail(userIdOrEmail);
    const errors = this.validateSearchForm(userIdOrEmail, isEmail);
    req.session.errors = errors;
    if (errors.length > 0) {
      res.redirect('/user-details-audit');
      return;
    }

    try {
      const { details, updates, updatesStatus } = await this.service.getUserDetails(req, isEmail);
      req.session.userDetailsData = {
        ...details,
        formattedAddresses: mapOrElse(details.organisationalAddress, formatAddress, [NOT_AVAILABLE_MSG]),
        formattedAccCreationDate: requestDateToFormDate(details.accountCreationDate, NOT_AVAILABLE_MSG),
        displayedStatus: formatStatus(details.accountStatus, details.recordType, NOT_AVAILABLE_MSG),
        userUpdateRows: this.transformUpdatesToRows(updates),
        updatesStatus,
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

  private transformUpdatesToRows(updates: UserUpdatesAuditData[]): GovukTableRow[] {
    return updates.map(update => [
      { text: mapEventName(update.eventName) },
      { text: capitalize(update.eventType) },
      { text: update.value },
      { text: formatDate(update.timestamp) },
      { text: update.principalId },
      { text: update.previousValue ?? '-' },
    ]);
  }

  private validateSearchForm(userIdOrEmail: string, isEmail: boolean): FormError[] {
    const errors: FormError[] = [];
    if (!userIdOrEmail) {
      errors.push({propertyName: 'userIdOrEmail', errorType: 'required'});
    }
    if (!isEmail && userIdOrEmail.length > 64) {
      errors.push({propertyName: 'userIdOrEmail', errorType: 'valueTooLong'});
    }

    return errors;
  }

  private isEmail(userIdOrEmail: string): boolean {
    const error = validEmail(userIdOrEmail);
    return !error;
  }

  public async postPdf(req: AppRequest<UserDetailsSearchRequest>, res: Response): Promise<void> {
    try {
      // Authoritative data must exist in session from previous search
      const cached = req.session?.userDetailsData;
      if (!cached) {
        res.status(400).send('No search results available to generate PDF');
        return;
      }

      // Prepare view model for PDF rendering
      // Render PDF template directly with session data
      const pdfHtml: string = await new Promise((resolve, reject) => {
        req.app.render('user-details/pdf-template.njk', { userDetailsAuditData: cached }, (err?: Error | null, rendered?: string) => {
          if (err) {
            return reject(err);
          }
          resolve(rendered);
        });
      });

      // Generate PDF from the PDF template
      const pdfBuffer = await (await import('../service/pdf-service')).renderHtmlToPdfBuffer(pdfHtml);

      // Generate filename using userId
      const filename = `${cached.userId}.pdf`;

      // Return PDF
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length,
      });
      res.send(pdfBuffer);
      return;
    } catch (err) {
      logger.error(err as Error, { stack: (err as Error)?.stack });
      res.status(500).send('Failed to generate PDF');
      return;
    }
  }
}

