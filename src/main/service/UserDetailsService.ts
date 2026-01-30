import config from 'config';
import {BaseService} from './BaseService';
import {ErrorCode} from '../models/AppError';
import {AppRequest, AppSession} from '../models/appRequest';
import {
  NOT_AVAILABLE_MSG,
  ServiceStatus,
  UpdatesStatus,
  UserDetailsAggregateResult,
  UserDetailsAuditData,
  UserDetailsMeta,
  UserUpdatesAuditData,
  UserUpdatesAuditDataResponse,
} from '../models/user-details/UserDetailsAuditData';
import {UserDetailsSearchRequest} from '../models/user-details/UserDetailsSearchRequest';
import log from '../modules/logging';


export class UserDetailsService extends BaseService<UserDetailsSearchRequest> {
  baseApiUrl = String(config.get('services.lau-eud-backend.url'));
  userDetailsEndpoint = String(config.get('services.lau-eud-backend.endpoints.userDetails'));
  userUpdatesEndpoint = String(config.get('services.lau-eud-backend.endpoints.userAccountUpdates'));
  pageSize = Number(config.get('pagination.maxPerPage'));
  errorCode = ErrorCode.EUD_BACKEND;

  public async getUserDetails(req: AppRequest<UserDetailsSearchRequest>, isEmail: boolean): Promise<UserDetailsAggregateResult> {
    const userIdOrEmail = req.session.userDetailsFormState.userIdOrEmail;
    const queryParam = isEmail? 'email': 'userId';
    const loggedValue = isEmail ? '[REDACTED]' : userIdOrEmail;
    const userDetailsPath = `${this.userDetailsEndpoint}?${queryParam}=${userIdOrEmail}`;
    log.debug(`Calling userDetails - ${this.userDetailsEndpoint}?${queryParam}=${loggedValue}`);
    const userDetails = await this.get(req.session, userDetailsPath) as UserDetailsAuditData;
    const updates = await this.tryGetUserUpdates(req.session, userDetails.userId);
    const details = this.transformData(userDetails, userIdOrEmail);
    return { details, updates: updates.updates, updatesStatus: updates.status };
  }

  private async tryGetUserUpdates(session: AppSession, userId?: string | null): Promise<{ updates: UserUpdatesAuditData[]; status: UpdatesStatus }> {
    if (!userId) {
      return { updates: [], status: UpdatesStatus.NOT_APPLICABLE };
    }
    try {

      const updates = await this.getUserUpdates(session, userId);
      console.log(updates);
      return { updates, status: updates.length > 0 ? UpdatesStatus.AVAILABLE: UpdatesStatus.EMPTY };
    } catch (e) {
      log.warn('Failed to fetch user updates; continuing with user details only', { error: e, userId });
      return { updates: [], status: UpdatesStatus.UNAVAILABLE };
    }
  }


  private async getUserUpdates(session: AppSession, userId?: string): Promise<UserUpdatesAuditData[]> {
    const userUpdatesPath = `${this.userUpdatesEndpoint}?userId=${userId}&size=${this.pageSize}`;
    log.debug(`Calling userUpdates - ${this.baseApiUrl}${userUpdatesPath}`);
    const updatesResponse = await this.get(session, userUpdatesPath) as UserUpdatesAuditDataResponse;
    // TODO there is a potential for more than one page though unlikely anyone would go over 100 updates
    return updatesResponse.content;
  }

  private transformData(data: UserDetailsAuditData, userId: string): UserDetailsAuditData {
    const base = {
      userId: data.userId ?? userId,
      email: data.email ?? null,
      accountStatus: data.accountStatus ?? null,
      recordType: data.recordType ?? null,
      accountCreationDate: data.accountCreationDate ?? null,
      roles: data.roles ?? [],
      organisationalAddress: data.organisationalAddress ?? [],
      meta: data.meta,
      hasData: false,
      sourceStatus: this.statusFrom(data.meta),
    } as UserDetailsAuditData;
    const msg = NOT_AVAILABLE_MSG;
    const byStatus: Record<ServiceStatus, (u: UserDetailsAuditData) => UserDetailsAuditData> = {
      ALL_OK: u => ({...u, hasData: true}),
      IDAM_ONLY: u => ({...u, hasData: true, organisationalAddress: []}),
      REFDATA_ONLY: u => ({...u, hasData: true, email: msg, roles: [msg]}),
      NONE_OK: u => ({...u, hasData: false}),
    };
    return byStatus[base.sourceStatus](base);
  }

  private is2xx(code: number): boolean {
    return !!code && code >= 200 && code < 300;
  }

  private statusFrom(meta: UserDetailsMeta): ServiceStatus {
    const idamOk = this.is2xx(meta.idam.responseCode);
    const refdataOk = this.is2xx(meta.refdata.responseCode);
    if (idamOk && refdataOk) {
      return ServiceStatus.ALL_OK;
    }
    if (idamOk) {
      return ServiceStatus.IDAM_ONLY;
    }
    if (refdataOk) {
      return ServiceStatus.REFDATA_ONLY;
    }
    return ServiceStatus.NONE_OK;
  }
}
