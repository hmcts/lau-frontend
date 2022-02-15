import {LoggerInstance} from 'winston';
const {Logger} = require('@hmcts/nodejs-logging');

import autobind from 'autobind-decorator';
import config from 'config';
import {CaseService} from '../service/CaseService';
import {AppRequest, LogData} from '../models/appRequest';
import {csvDate, requestDateToFormDate} from '../util/Date';
import {CaseSearchLog, CaseSearchLogs} from '../models/case/CaseSearchLogs';
import {Response} from 'express';
import {jsonToCsv} from '../util/CsvHandler';

/**
 * Case Searches Controller class to handle case searches tab functionality
 */
@autobind
export class CaseSearchesController {
  private logger: LoggerInstance = Logger.getLogger('CaseSearchesController');

  private service = new CaseService();

  public async getLogData(req: AppRequest): Promise<LogData> {
    this.logger.info('getLogData called');
    return this.service.getCaseSearches(req).then(caseSearches => {
      this.logger.info('Case searches retrieved');
      const recordsPerPage = Number(config.get('pagination.maxPerPage'));
      return {
        hasData: caseSearches.searchLog.length > 0,
        rows: this.convertDataToTableRows(caseSearches.searchLog),
        noOfRows: caseSearches.searchLog.length,
        totalNumberOfRecords: caseSearches.totalNumberOfRecords,
        startRecordNumber: caseSearches.startRecordNumber,
        moreRecords: caseSearches.moreRecords,
        currentPage: req.session.caseFormState.page,
        lastPage: caseSearches.totalNumberOfRecords > 0 ? Math.ceil(caseSearches.totalNumberOfRecords / recordsPerPage) : 1,
      };
    });
  }

  /**
   * Function to return the next set of log data for the case searches data
   *
   * @param req AppRequest - extension of Express Request
   * @param res Express Response
   */
  public async getPage(req: AppRequest, res: Response): Promise<void> {
    const searchForm = req.session.caseFormState || {};
    searchForm.page = Number(req.params.pageNumber) || 1;

    this.logger.info('CaseSearches search for page ', req.params.pageNumber);

    await this.getLogData(req).then(logData => {
      req.session.caseSearches = logData;
      res.redirect('/#case-searches-tab');
    }).catch((err) => {
      this.logger.error(err);
      res.redirect('/error');
    });
  }

  public async getCsv(req: AppRequest, res: Response): Promise<void> {
    return this.service.getCaseSearches(req, true).then(caseSearches => {
      const caseSearchLogs = new CaseSearchLogs(caseSearches.searchLog);
      const filename = `caseSearches ${csvDate()}.csv`;
      jsonToCsv(caseSearchLogs).then(csv => {
        res.status(200).json({filename, csv});
      });
    });
  }

  private convertDataToTableRows(logs: CaseSearchLog[]): {text:string, classes?: string}[][] {
    const rows: {text:string}[][] = [];
    logs.forEach((log) => {
      const row: {text: string, classes?: string}[] = [];
      const keys = Object.keys(log);
      keys.forEach((key: keyof CaseSearchLog) => row.push(this.formatRowData(log, key)));

      rows.push(row);
    });

    return rows;
  }

  private formatRowData(log: CaseSearchLog, key: keyof CaseSearchLog): {text: string, classes?: string} {
    switch (key) {
      case 'caseRefs':
        return { text: String(log[key]).replace(/,/g, ', '), classes: 'overflow-wrap' };
      case 'timestamp':
        return { text: requestDateToFormDate(log[key]), classes: 'overflow-wrap' };
      default:
        return { text: String(log[key]), classes: 'overflow-wrap' };
    }
  }
}
