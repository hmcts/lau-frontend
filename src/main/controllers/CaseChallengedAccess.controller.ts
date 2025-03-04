import logger from '../modules/logging';

import autobind from 'autobind-decorator';
import config from 'config';
import {AppRequest, LogData} from '../models/appRequest';
import {Response} from 'express';
import {CaseChallengedAccesses} from '../models/challenged-access/CaseChallengedAccesses';
import {CaseChallengedAccessLog, CaseChallengedAccessLogs, caseChallengedAccessLogOrder} from '../models/challenged-access/CaseChallengedAccessLogs';
import {AppError, ErrorCode, errorRedirect} from '../models/AppError';
import {challengedAccessService} from '../service/ChallengedAccessService';
import {csvDate, requestDateToFormDate} from '../util/Date';
import {csvJson} from '../util/CsvHandler';

/**
 * Search Controller class to handle search tab functionality
 */
@autobind
export class CaseChallengedAccessController {

  private service = new challengedAccessService();

  public async getLogData(req: AppRequest): Promise<LogData> {
    logger.info('getLogData called');
    return new Promise((resolve, reject) => {
      this.service.getChallengedAccess(req).then((caseChallengedAccesses: CaseChallengedAccesses) => {
        if (caseChallengedAccesses.accessLog) {
          const recordsPerPage = Number(config.get('pagination.maxPerPage'));
          resolve({
            hasData: caseChallengedAccesses.accessLog.length > 0,
            rows: this.convertDataToTableRows(caseChallengedAccesses.accessLog),
            noOfRows: caseChallengedAccesses.accessLog.length,
            totalNumberOfRecords: caseChallengedAccesses.totalNumberOfRecords,
            startRecordNumber: caseChallengedAccesses.startRecordNumber,
            moreRecords: caseChallengedAccesses.moreRecords,
            currentPage: req.session.caseChallengedAccessFormState.page ? req.session.caseChallengedAccessFormState.page : 1,
            lastPage: caseChallengedAccesses.totalNumberOfRecords > 0 ? Math.ceil(caseChallengedAccesses.totalNumberOfRecords / recordsPerPage) : 1,
          });
        } else {
          const errMsg = 'Case access request data malformed';
          logger.error(errMsg);
          reject(new AppError(errMsg, ErrorCode.CASE_BACKEND));
        }
      }).catch((err: AppError) => {
        logger.error(err.message);
        reject(err);
      });
    });
  }

  /**
   * Function to return the next set of log data for the case searches data
   *
   * @param req AppRequest - extension of Express Request
   * @param res Express Response
   */
  public async getPage(req: AppRequest, res: Response): Promise<void> {
    const searchForm = req.session.caseChallengedAccessFormState || {};
    searchForm.page = Number(req.params.pageNumber) || 1;

    logger.info('ChallengedAccess search for page ', req.params.pageNumber);

    await this.getLogData(req).then(logData => {
      req.session.challengedAccessData = logData;
      res.redirect('/challenged-specific-access');
    }).catch((err: AppError) => {
      logger.error(err.message);
      errorRedirect(res, err.code);
    });
  }

  public async getCsv(req: AppRequest, res: Response): Promise<void> {
    return this.service.getChallengedAccess(req, true).then(caseChallengedAccesses => {
      const challengeAccessLogs = new CaseChallengedAccessLogs(caseChallengedAccesses.accessLog);
      const filename = `caseChallengedAccess ${csvDate()}.csv`;
      res.status(200).json({filename, csvJson: csvJson(challengeAccessLogs)});
    });
  }

  private convertDataToTableRows(logs: CaseChallengedAccessLog[]): {text: string, classes: string}[][] {
    const rows: {text: string, classes: string}[][] = [];
    logs.forEach((log) => {
      const row: {text: string, classes: string}[] = [];
      caseChallengedAccessLogOrder.forEach((fieldName: string) => {
        const text = this.getFieldText(fieldName, log);
        row.push({ text, classes: 'overflow-wrap' });
      });
      rows.push(row);
    });

    return rows;
  }


  private getFieldText(fieldName: string, log: CaseChallengedAccessLog): string {
    if (fieldName === 'reason') {
      return log[fieldName] == null ? 'N/A' : log[fieldName];
    }

    if (fieldName === 'timestamp' || fieldName === 'requestEndTimestamp') {
      // @ts-ignore
      return requestDateToFormDate(log[fieldName]);
    }
    // @ts-ignore
    return log[fieldName];
  }

}
