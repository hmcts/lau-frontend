import {LoggerInstance} from 'winston';
import autobind from 'autobind-decorator';
import config from 'config';
import {Response} from 'express';
import {AppRequest, LogData} from '../models/appRequest';
import {csvDate, requestDateToFormDate} from '../util/Date';
import {csvJson} from '../util/CsvHandler';
import {AppError, ErrorCode, errorRedirect} from '../models/AppError';
import {DeletedUsersService} from '../service/DeletedUsersService';
import {DeletedUsersLog, DeletedUsersLogs, deletedUsersLogsOrder} from '../models/user-deletions/DeletedUsersLog';

const {Logger} = require('@hmcts/nodejs-logging');

/**
 * Logons Controller class to handle logon results tab functionality.
 */
@autobind
export class DeletedUsersController {
  private logger: LoggerInstance = Logger.getLogger('DeletedUsersController');

  private service = new DeletedUsersService();

  public async getDeletedUsersData(req: AppRequest): Promise<LogData> {
    this.logger.info('getDeletedUsersData called');
    return new Promise((resolve, reject) => {
      this.service.getDeletedUsers(req).then(deletedUsers => {
        if (deletedUsers.deletionLogs) {
          const recordsPerPage = Number(config.get('pagination.maxPerPage'));
          resolve({
            hasData: deletedUsers.deletionLogs.length > 0,
            rows: this.convertDataToTableRows(deletedUsers.deletionLogs),
            noOfRows: deletedUsers.deletionLogs.length,
            totalNumberOfRecords: deletedUsers.totalNumberOfRecords,
            startRecordNumber: deletedUsers.startRecordNumber,
            moreRecords: deletedUsers.moreRecords,
            currentPage: req.session.deletedUsersFormState.page ? req.session.deletedUsersFormState.page : 1,
            lastPage: deletedUsers.totalNumberOfRecords > 0 ? Math.ceil(deletedUsers.totalNumberOfRecords / recordsPerPage) : 1,
          });
        } else {
          const errMsg = 'Deleted users data malformed';
          this.logger.error(errMsg);
          reject(new AppError(errMsg, ErrorCode.IDAM_BACKEND));
        }
      }).catch((err: AppError) => {
        this.logger.error(err.message);
        reject(err);
      });
    });
  }

  /**
     * Function to return the next set of log data for the logon data.
     *
     * @param req AppRequest - extension of Express Request
     * @param res Express Response
     */
  public async getPage(req: AppRequest, res: Response): Promise<void> {
    const searchForm = req.session.deletedUsersFormState || {};
    searchForm.page = Number(req.params.pageNumber) || 1;

    this.logger.info('Deleted users search for page ', req.params.pageNumber);

    await this.getDeletedUsersData(req).then(deletedUsersData => {
      req.session.userDeletions = deletedUsersData;
      res.redirect('/user-deletion-audit#results-section');
    }).catch((err: AppError) => {
      this.logger.error(err.message);
      errorRedirect(res, err.code);
    });
  }

  public async getCsv(req: AppRequest, res: Response): Promise<void> {
    return this.service.getDeletedUsers(req, true).then(logons => {
      const deletedUsersLog = new DeletedUsersLogs(logons.deletionLogs);
      const filename = `deleted_users-${csvDate()}.csv`;
      res.status(200).json({filename, csvJson: csvJson(deletedUsersLog)});
    });
  }

  private convertDataToTableRows(logs: DeletedUsersLog[]): {text: string, classes: string}[][] {
    const rows: {text: string, classes: string}[][] = [];
    logs.forEach((log) => {
      const row: {text: string, classes: string}[] = [];

      deletedUsersLogsOrder.forEach((fieldName: string) => {
        // @ts-ignore
        const text = fieldName === 'deletionTimestamp' ? requestDateToFormDate(log[fieldName]) : log[fieldName];
        row.push({ text, classes: 'overflow-wrap' });
      });

      rows.push(row);
    });

    return rows;
  }

}
