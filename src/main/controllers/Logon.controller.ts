import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import autobind from 'autobind-decorator';
import config from 'config';
import {Response} from 'express';
import {LogonService} from '../service/LogonService';
import {AppRequest, LogData} from '../models/appRequest';
import {LogonLog, LogonLogs} from '../models/idam/LogonLogs';
import {csvDate, requestDateToFormDate} from '../util/Date';
import {jsonToCsv} from '../util/CsvHandler';

/**
 * Logons Controller class to handle logon results tab functionality.
 */
@autobind
export class LogonController {
  private logger: LoggerInstance = Logger.getLogger('LogonsController');

  private service = new LogonService();

  public async getLogData(req: AppRequest): Promise<LogData> {
    this.logger.info('getLogData called');
    return this.service.getLogons(req).then(logons => {
      const recordsPerPage = Number(config.get('pagination.maxPerPage'));
      return {
        hasData: logons.logonLog.length > 0,
        rows: this.convertDataToTableRows(logons.logonLog),
        noOfRows: logons.logonLog.length,
        totalNumberOfRecords: logons.totalNumberOfRecords,
        startRecordNumber: logons.startRecordNumber,
        moreRecords: logons.moreRecords,
        currentPage: req.session.logonFormState.page,
        lastPage: logons.totalNumberOfRecords > 0 ? Math.ceil(logons.totalNumberOfRecords / recordsPerPage) : 1,
      };
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

    this.logger.info('Logon search for page ', req.params.pageNumber);

    await this.getLogData(req).then(logData => {
      req.session.logons = logData;
      res.redirect('/#logons-tab');
    }).catch((err) => {
      this.logger.error(err);
      res.redirect('/error');
    });
  }

  public async getCsv(req: AppRequest, res: Response): Promise<void> {
    return this.service.getLogons(req, true).then(logons => {
      const logonLogs = new LogonLogs(logons.logonLog);
      const filename = `logon ${csvDate()}.csv`;
      jsonToCsv(logonLogs).then(csv => {
        res.status(200).json({filename, csv});
      });
    });
  }

  private convertDataToTableRows(logs: LogonLog[]): {text: string, classes: string}[][] {
    const rows: {text: string, classes: string}[][] = [];
    logs.forEach((log) => {
      const row: {text: string, classes: string}[] = [];
      const keys = Object.keys(log);
      keys.forEach((key: keyof LogonLog) => {
        const text = key === 'timestamp' ? requestDateToFormDate(log[key]) : log[key];
        row.push({ text, classes: 'overflow-wrap' });
      });

      rows.push(row);
    });

    return rows;
  }

}
