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
} from '../models/user-details/UserDetailsAuditData';
import {UserDetailsSearchRequest} from '../models/user-details/UserDetailsSearchRequest';
import log from '../modules/logging';
import {UserUpdatesService} from './UserUpdatesService';


export class UserDetailsService extends BaseService<UserDetailsSearchRequest> {
  baseApiUrl = String(config.get('services.lau-eud-backend.url'));
  userDetailsEndpoint = String(config.get('services.lau-eud-backend.endpoints.userDetails'));
  errorCode = ErrorCode.EUD_BACKEND;

  constructor(private readonly userUpdatesService = new UserUpdatesService()) {
    super();
  }

  public async getUserDetails(req: AppRequest<UserDetailsSearchRequest>, isEmail: boolean): Promise<UserDetailsAggregateResult> {
    const userIdOrEmail = req.session.userDetailsFormState.userIdOrEmail;
    const queryParam = isEmail? 'email': 'userId';
    const loggedValue = isEmail ? '[REDACTED]' : userIdOrEmail;
    const encoded = encodeURIComponent((String(userIdOrEmail)));
    const userDetailsPath = `${this.userDetailsEndpoint}?${queryParam}=${encoded}`;
    log.debug(`Calling userDetails - ${this.userDetailsEndpoint}?${queryParam}=${loggedValue}`);
    const userDetails = await this.get(req.session, userDetailsPath) as UserDetailsAuditData;
    const updates = await this.tryGetUserUpdates(req.session, isEmail ? userDetails.userId : userIdOrEmail);
    const details = this.transformData(userDetails, userIdOrEmail);
    return { details, updates: updates.updates, updatesStatus: updates.status };
  }

  private async tryGetUserUpdates(
    session: AppSession,
    userId: string | null,
  ): Promise<{ updates: UserUpdatesAuditData[]; status: UpdatesStatus }> {

    if (!userId) {
      return { updates: [], status: UpdatesStatus.NOT_APPLICABLE };
    }

    try {
      const updates = await this.userUpdatesService.getUserUpdates(session, userId);
      return { updates, status: updates.length > 0 ? UpdatesStatus.AVAILABLE: UpdatesStatus.EMPTY };
    } catch (e) {
      log.warn('Failed to fetch user updates; continuing with user details only', { error: e, userId });
      return { updates: [], status: UpdatesStatus.UNAVAILABLE };
    }
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
