import logger from '../modules/logging';

import autobind from 'autobind-decorator';
import config from 'config';
import {Response} from 'express';
import {LogonService} from '../service/LogonService';
import {AppRequest, LogData} from '../models/appRequest';
import {LogonLog, LogonLogs, logonLogsOrder} from '../models/idam/LogonLogs';
import {csvDate, requestDateToFormDate} from '../util/Date';
import {csvJson} from '../util/CsvHandler';
import {AppError, ErrorCode, errorRedirect} from '../models/AppError';

/**
 * Logons Controller class to handle logon results tab functionality.
 */
@autobind
export class LogonController {

  private service = new LogonService();

  public async getLogData(req: AppRequest): Promise<LogData> {
    logger.info('getLogData called');
    return new Promise((resolve, reject) => {
      this.service.getLogons(req).then(logons => {
        if (logons.logonLog) {
          const recordsPerPage = Number(config.get('pagination.maxPerPage'));
          resolve({
            hasData: logons.logonLog.length > 0,
            rows: this.convertDataToTableRows(logons.logonLog),
            noOfRows: logons.logonLog.length,
            totalNumberOfRecords: logons.totalNumberOfRecords,
            startRecordNumber: logons.startRecordNumber,
            moreRecords: logons.moreRecords,
            currentPage: req.session.logonFormState.page ? req.session.logonFormState.page : 1,
            lastPage: logons.totalNumberOfRecords > 0 ? Math.ceil(logons.totalNumberOfRecords / recordsPerPage) : 1,
          });
        } else {
          const errMsg = 'Logons data malformed';
          logger.error(errMsg);
          reject(new AppError(errMsg, ErrorCode.IDAM_BACKEND));
        }
      }).catch((err: AppError) => {
        logger.error(err.message);
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
    const searchForm = req.session.logonFormState || {};
    searchForm.page = Number(req.params.pageNumber) || 1;

    logger.info('Logon search for page ', req.params.pageNumber);

    await this.getLogData(req).then(logData => {
      req.session.logons = logData;
      res.redirect('/logon-audit#results-section');
    }).catch((err: AppError) => {
      logger.error(err.message);
      errorRedirect(res, err.code);
    });
  }

  public async getCsv(req: AppRequest, res: Response): Promise<void> {
    return this.service.getLogons(req, true).then(logons => {
      const logonLogs = new LogonLogs(logons.logonLog);
      const filename = `logon ${csvDate()}.csv`;
      res.status(200).json({filename, csvJson: csvJson(logonLogs)});
    });
  }

  private convertDataToTableRows(logs: LogonLog[]): {text: string, classes: string}[][] {
    const rows: {text: string, classes: string}[][] = [];
    logs.forEach((log) => {
      const row: {text: string, classes: string}[] = [];

      logonLogsOrder.forEach((fieldName: string) => {
        // @ts-ignore
        const text = fieldName === 'timestamp' ? requestDateToFormDate(log[fieldName]) : log[fieldName];
        row.push({ text, classes: 'overflow-wrap' });
      });

      rows.push(row);
    });

    return rows;
  }

}
