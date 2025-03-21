import logger from '../modules/logging';

import autobind from 'autobind-decorator';
import config from 'config';
import {Response} from 'express';
import {AppRequest, LogData} from '../models/appRequest';
import {csvDate, requestDateToFormDate} from '../util/Date';
import {csvJson} from '../util/CsvHandler';
import {AppError, ErrorCode, errorRedirect} from '../models/AppError';
import {CaseDeletionsLog, CaseDeletionsLogs} from '../models/deletions/CaseDeletionsLogs';
import {CaseService} from '../service/CaseService';
import {CaseDeletions} from '../models/deletions/CaseDeletions';

/**
 * Case Deletions Controller class to handle case deletions results tab functionality.
 */
@autobind
export class CaseDeletionsController {

  private service = new CaseService();

  public async getLogData(req: AppRequest): Promise<LogData> {
    logger.info('getLogData called');
    return new Promise((resolve, reject) => {
      this.service.getCaseDeletions(req).then((caseDeletions: CaseDeletions) => {
        if (caseDeletions.actionLog) {
          const recordsPerPage = Number(config.get('pagination.maxPerPage'));
          resolve({
            hasData: caseDeletions.actionLog.length > 0,
            rows: this.convertDataToTableRows(caseDeletions.actionLog),
            noOfRows: caseDeletions.actionLog.length,
            totalNumberOfRecords: caseDeletions.totalNumberOfRecords,
            startRecordNumber: caseDeletions.startRecordNumber,
            moreRecords: caseDeletions.moreRecords,
            currentPage: req.session.caseDeletionsFormState.page ? req.session.caseDeletionsFormState.page : 1,
            lastPage: caseDeletions.totalNumberOfRecords > 0 ? Math.ceil(caseDeletions.totalNumberOfRecords / recordsPerPage) : 1,
          });
        } else {
          const errMsg = 'Case deletions data malformed';
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
   * Function to return the next set of log data for the case deletions data.
   *
   * @param req AppRequest - extension of Express Request
   * @param res Express Response
   */
  public async getPage(req: AppRequest, res: Response): Promise<void> {
    const searchForm = req.session.caseDeletionsFormState || {};
    searchForm.page = Number(req.params.pageNumber) || 1;

    logger.info('Case deletions search for page ', req.params.pageNumber);

    await this.getLogData(req).then(logData => {
      req.session.caseDeletions = logData;
      res.redirect('/case-deletion-audit#results-section');
    }).catch((err: AppError) => {
      logger.error(err.message);
      errorRedirect(res, err.code);
    });
  }

  public async getCsv(req: AppRequest, res: Response): Promise<void> {
    return this.service.getCaseDeletions(req, true).then(caseDeletions => {
      const caseDeletionLogs = new CaseDeletionsLogs(caseDeletions.actionLog);
      const filename = `caseDeletions ${csvDate()}.csv`;
      res.status(200).json({filename, csvJson: csvJson(caseDeletionLogs)});
    });
  }

  private convertDataToTableRows(logs: CaseDeletionsLog[]): {text: string, classes: string}[][] {
    const rows: {text: string, classes: string}[][] = [];
    logs.forEach((log) => {
      const row: {text: string, classes: string}[] = [];
      const keys = Object.keys(log);
      keys.forEach((key: keyof CaseDeletionsLog) => {
        const text = key === 'timestamp' ? requestDateToFormDate(log[key]) : log[key];
        row.push({ text, classes: 'overflow-wrap' });
      });

      rows.push(row);
    });

    return rows;
  }

}
