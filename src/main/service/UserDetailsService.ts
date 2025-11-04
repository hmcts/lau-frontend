import config from 'config';
import {BaseService} from './BaseService';
import {ErrorCode} from '../models/AppError';
import {AppRequest} from '../models/appRequest';
import {
  NOT_AVAILABLE_MSG,
  ServiceStatus,
  UserDetailsAuditData,
  UserDetailsMeta,
} from '../models/user-details/UserDetailsAuditData';
import {UserDetailsSearchRequest} from '../models/user-details/UserDetailsSearchRequest';
import logger from '../modules/logging';


export class UserDetailsService extends BaseService<UserDetailsSearchRequest> {
  baseApiUrl = String(config.get('services.lau-eud-backend.url'));
  errorCode = ErrorCode.EUD_BACKEND;

  public async getUserDetails(req: AppRequest<UserDetailsSearchRequest>, isEmail: boolean): Promise<UserDetailsAuditData> {
    const endpoint: string = config.get('services.lau-eud-backend.endpoints.userDetails');
    const userIdOrEmail = req.session.userDetailsFormState.userIdOrEmail;
    const queryParam = isEmail? 'email': 'userId';
    const path = `${endpoint}?${queryParam}=${userIdOrEmail}`;
    logger.info(`Calling userDetails - ${this.baseApiUrl}${path}`);
    const response = await this.get(req.session, path) as UserDetailsAuditData;// as Promise<UserDetailsAuditData>;
    return this.transformData(response, userIdOrEmail);
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
