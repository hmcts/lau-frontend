import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import autobind from 'autobind-decorator';
import config from 'config';
import {Response} from 'express';
import {CaseService} from '../service/CaseService';
import {AppRequest, LogData} from '../models/appRequest';
import {CaseActivityLog, CaseActivityLogs} from '../models/case/CaseActivityLogs';
import {csvDate, requestDateToFormDate} from '../util/Date';
import {csvJson} from '../util/CsvHandler';

/**
 * Case Activity Controller class to handle case activity tab functionality
 */
@autobind
export class CaseActivityController {
  private logger: LoggerInstance = Logger.getLogger('CaseActivityController');

  private service = new CaseService();

  public async getLogData(req: AppRequest): Promise<LogData> {
    this.logger.info('getLogData called');
    return this.service.getCaseActivities(req).then(caseActivities => {
      this.logger.info('Case activities retrieved');

      const recordsPerPage = Number(config.get('pagination.maxRecords'));
      return {
        hasData: caseActivities.actionLog.length > 0,
        rows: this.convertDataToTableRows(caseActivities.actionLog),
        noOfRows: caseActivities.actionLog.length,
        totalNumberOfRecords: caseActivities.totalNumberOfRecords,
        startRecordNumber: caseActivities.startRecordNumber,
        moreRecords: caseActivities.moreRecords,
        currentPage: req.session.caseFormState.page,
        lastPage: caseActivities.totalNumberOfRecords > 0 ? Math.ceil(caseActivities.totalNumberOfRecords / recordsPerPage) : 1,
      };
    });
  }

  /**
   * Function to return the next set of log data for the case activity data
   *
   * @param req AppRequest - extension of Express Request
   * @param res Express Response
   */
  public async getPage(req: AppRequest, res: Response): Promise<void> {
    const searchForm = req.session.caseFormState || {};
    searchForm.page = Number(req.params.pageNumber) || 1;

    this.logger.info('CaseActivity search for page ', req.params.pageNumber);

    await this.getLogData(req).then(logData => {
      req.session.caseActivities = logData;
      res.redirect('/#case-activity-tab');
    }).catch((err) => {
      this.logger.error(err);
      res.redirect('/error');
    });
  }

  public async getCsv(req: AppRequest, res: Response): Promise<void> {
    return this.service.getCaseActivities(req, true).then(caseActivities => {
      const caseActivityLogs = new CaseActivityLogs(caseActivities.actionLog);
      const filename = `caseActivity ${csvDate()}.csv`;

      res.status(200).json({filename, csvJson: csvJson(caseActivityLogs)});
    });
  }

  private convertDataToTableRows(logs: CaseActivityLog[]): {text: string, classes: string}[][] {
    const rows: {text: string, classes: string}[][] = [];
    logs.forEach((log) => {
      const row: {text: string, classes: string}[] = [];
      const keys = Object.keys(log);
      keys.forEach((key: keyof CaseActivityLog) => {
        const text = key === 'timestamp' ? requestDateToFormDate(log[key]) : log[key];
        row.push({ text, classes: 'overflow-wrap' });
      });

      rows.push(row);
    });

    return rows;
  }

}
