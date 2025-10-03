import {escape} from 'lodash';

export interface AccountUpdate {
  type: 'ADD'|'MODIFY';
  name: string;
  value: string;
}

export interface Address {
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  townCity: string | null;
  county: string | null;
  country: string | null;
  postCode: string | null;
}

export interface UserDetailsAuditData {
  userId: string;
  email: string;
  accountStatus: string;
  accountCreationDate: string;
  roles: string[];
  accountUpdates?: AccountUpdate[] | null;
  organisationalAddress: Address[];
  formattedAddresses?: string[];
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
