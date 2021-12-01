import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import autobind from 'autobind-decorator';
import {Response} from 'express';
import {CaseService} from '../service/CaseService';
import {AppRequest, LogData} from '../models/appRequest';
import {CaseActivityLog, CaseActivityLogs} from '../models/case/CaseActivityLogs';
import {csvDate, requestDateToFormDate} from '../util/Date';
import {jsonToCsv} from '../util/CsvHandler';

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
      return {
        hasData: caseActivities.actionLog.length > 0,
        rows: this.convertDataToTableRows(caseActivities.actionLog),
        noOfRows: caseActivities.actionLog.length,
        startRecordNumber: caseActivities.startRecordNumber,
        moreRecords: caseActivities.moreRecords,
        currentPage: req.session.caseFormState.page,
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
    return this.service.getCaseActivities(req).then(caseActivities => {
      const caseActivityLogs = new CaseActivityLogs(caseActivities.actionLog);
      const filename = `caseActivity ${csvDate()}.csv`;
      jsonToCsv(caseActivityLogs).then(csv => {
        res.status(200).json({filename, csv});
      });
    });
  }

  private convertDataToTableRows(logs: CaseActivityLog[]): {text:string}[][] {
    const splitList = logs.length > 12;

    const rows: {text:string}[][] = [];
    logs.slice(0, splitList ? 10 : 12).forEach((log) => {
      const row: {text: string}[] = [];
      const keys = Object.keys(log);
      keys.forEach((key: keyof CaseActivityLog) => {
        const text = key === 'timestamp' ? requestDateToFormDate(log[key]) : log[key];
        row.push({ text });
      });

      rows.push(row);
    });

    if (splitList) {
      const lastLog = logs.slice(-1)[0];
      const keys = Object.keys(lastLog);

      const elipsesRow = [{text: '...'}].concat(Array(keys.length - 1).fill({text: ''}));
      rows.push(elipsesRow);

      const row: {text: string}[] = [];
      keys.forEach((key: keyof CaseActivityLog) => {
        const text = key === 'timestamp' ? requestDateToFormDate(lastLog[key]) : lastLog[key];
        row.push({ text });
      });
      rows.push(row);
    }

    return rows;
  }

}
