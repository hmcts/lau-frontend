import {escape} from 'lodash';

export type GovukTableRow = {text: string}[]
type ISODateTimeString = string;
type UpstreamResponse = { responseCode: number}

export const NOT_AVAILABLE_MSG = 'Not available - try again later';

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  LOCKED = 'LOCKED'
}

export enum AccountRecordType {
  ARCHIVED = 'ARCHIVED',
  LIVE = 'LIVE',
}

export enum UpdateEventType {
  MODIFY = 'MODIFY',
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

export enum UpdatesStatus {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',  // issue fetching updates
  EMPTY = 'EMPTY', // returned empty result list
  NOT_APPLICABLE = 'NOT_APPLICABLE', // couldn't even attempt to fetch, for example because user ID is not found
}

export interface UserDetailsAggregateResult {
  details: UserDetailsAuditData;
  updates: UserUpdatesAuditData[];
  updatesStatus: UpdatesStatus;
}

export interface Address {
  addressLine1?: string | null;
  addressLine2?: string | null;
  addressLine3?: string | null;
  townCity?: string | null;
  county?: string | null;
  country?: string | null;
  postCode?: string | null;
}

export interface UserDetailsMeta {
  idam: UpstreamResponse;
  refdata: UpstreamResponse;
}

export interface UserDetailsAuditData {
  userId: string;
  email: string | null;
  accountStatus: AccountStatus | null;
  recordType: AccountRecordType | null;
  accountCreationDate: ISODateTimeString | null;
  roles: string[];
  organisationalAddress: Address[];
  hasData?: boolean;
  meta: UserDetailsMeta;
  sourceStatus: ServiceStatus;
}

export interface UserUpdatesAuditData {
  eventName: string;
  eventType: UpdateEventType;
  value: string;
  timestamp: ISODateTimeString;
  principalId: string;
  previousValue: string;
}

export interface UserUpdatesAuditDataResponse {
  content: UserUpdatesAuditData[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UserDetailsViewModel extends UserDetailsAuditData {
  formattedAddresses?: string[];
  formattedAccCreationDate?: string;
  displayedStatus: string;
  userUpdateRows: GovukTableRow[];
  updatesStatus: string;
}

export enum ServiceStatus {
  ALL_OK = 'ALL_OK',
  IDAM_ONLY = 'IDAM_ONLY',
  REFDATA_ONLY = 'REFDATA_ONLY',
  NONE_OK = 'NONE_OK',
}


export function formatAddress(address: Address): string {
  const formatted = [
    address.addressLine1,
    address.addressLine2,
    address.addressLine3,
    address.townCity,
    address.county,
    address.country,
    address.postCode,
  ].filter(Boolean).join(', ');
  return escape(formatted);
}

export function formatStatus(accountStatus: AccountStatus, recordType: AccountRecordType, defaultMsg: string): string {
  if (recordType === AccountRecordType.ARCHIVED) {
    return 'Archived';
  }
  if (recordType === AccountRecordType.LIVE) {
    switch (accountStatus) {
      case AccountStatus.ACTIVE:
        return 'Live';
      case AccountStatus.LOCKED:
        return 'Live but locked';
      case AccountStatus.SUSPENDED:
        return 'Live but suspended';
      default:
        return defaultMsg;
    }
  }
  return defaultMsg;
}

const eventNameMapping: Record<string, string> = {
  'accountStatus': 'Account status',
  'email': 'Email address',
  'forename': 'Forename',
  'surname': 'Surname',
  'displayName': 'Display name',
};

export function mapEventName(eventName: string): string {
  return eventNameMapping[eventName] ?? eventName;
}
