import {BaseService} from './BaseService';

import config from 'config';
import {CaseActivityAudit} from '../models/case/CaseActivityAudit';
import {CaseSearchRequest} from '../models/case/CaseSearchRequest';
import {CaseDeletionsSearchRequest} from '../models/deletions/CaseDeletionsSearchRequest';
import {CaseSearchAudit} from '../models/case/CaseSearchAudit';
import {AppRequest} from '../models/appRequest';
import {ErrorCode} from '../models/AppError';
import {CaseDeletions} from '../models/deletions/CaseDeletions';

export class CaseService extends BaseService<CaseSearchRequest | CaseDeletionsSearchRequest> {
  baseApiUrl = String(config.get('services.lau-case-backend.url'));
  errorCode = ErrorCode.CASE_BACKEND;

  public getCaseActivities(req: AppRequest, csv = false): Promise<CaseActivityAudit> {
    const endpoint: string = config.get('services.lau-case-backend.endpoints.caseActivity');
    // Shallow clone state to prevent modifications to search params for csv case do not persist in session
    const searchParameters = {...req.session.caseFormState};
    if (csv) {
      searchParameters.page = 1;
      searchParameters.size = req.session.caseActivities?.totalNumberOfRecords || 0;
    }

    this.logger.info('getCaseActivities: ' + JSON.stringify(searchParameters) + ' CSV: ' + csv);
    return this.get(req.session, endpoint, this.getQueryString(searchParameters)) as Promise<CaseActivityAudit>;
  }

  public getCaseSearches(req: AppRequest, csv = false): Promise<CaseSearchAudit> {
    const endpoint: string = config.get('services.lau-case-backend.endpoints.caseSearch');
    // Shallow clone state to prevent modifications to search params for csv case do not persist in session
    const searchParameters = {...req.session.caseFormState};
    if (csv) {
      searchParameters.page = 1;
      searchParameters.size = req.session.caseSearches?.totalNumberOfRecords || 0;
    }
    this.logger.info('getCaseSearches: ' + JSON.stringify(searchParameters) + ' CSV: ' + csv);
    return this.get(req.session, endpoint, this.getQueryString(searchParameters)) as Promise<CaseSearchAudit>;
  }

  public getCaseDeletions(req: AppRequest, csv = false): Promise<CaseDeletions> {
    const endpoint: string = config.get('services.lau-case-backend.endpoints.caseActivity');
    // Shallow clone state to prevent modifications to search params for csv case do not persist in session
    const searchParameters = {...req.session.caseDeletionsFormState};
    if (csv) {
      searchParameters.page = 1;
      searchParameters.size = req.session.caseDeletions?.totalNumberOfRecords || 0;
    }
    this.logger.info('getCaseDeletions: ' + JSON.stringify(searchParameters) + ' CSV: ' + csv);

    return this.get(req.session, endpoint, this.getQueryString(searchParameters)).then((caseActivityAudit: CaseActivityAudit) => {
      const actionLog = caseActivityAudit.actionLog ? caseActivityAudit.actionLog.map(log => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { userId, caseAction, ...deletionsLog } = log;
        return deletionsLog;
      }) : null;

      const caseDeletions: CaseDeletions = {
        ...caseActivityAudit,
        actionLog,
      };

      return caseDeletions;
    });
  }
}
