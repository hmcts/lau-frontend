import {escape} from 'lodash';

export interface AccountUpdate {
  type: 'ADD'|'MODIFY';
  name: string;
  value: string;
}

export const NOT_AVAILABLE_MSG = 'Not available - try again later';

export interface Address {
  addressLine1?: string | null;
  addressLine2?: string | null;
  addressLine3?: string | null;
  townCity?: string | null;
  county?: string | null;
  country?: string | null;
  postCode?: string | null;
}

type UpstreamResponse = { responseCode: number}

export interface UserDetailsMeta {
  idam: UpstreamResponse;
  refdata: UpstreamResponse;
}

export interface UserDetailsAuditData {
  userId: string;
  email: string | null;
  accountStatus: string | null;
  accountCreationDate: string | null;
  roles: string[];
  accountUpdates?: AccountUpdate[] | null;
  organisationalAddress: Address[];
  hasData?: boolean;
  meta: UserDetailsMeta;
  sourceStatus: ServiceStatus;
}

export interface UserDetailsViewModel extends UserDetailsAuditData {
  formattedAddresses?: string[];
  formattedAccCreationDate?: string;
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
