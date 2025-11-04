import {AccountRecordType, AccountStatus, formatStatus} from '../../../main/models/user-details';


describe('UserDetailsAuditData', () => {
  it('formats status', () => {
    expect(formatStatus(AccountStatus.ACTIVE, AccountRecordType.LIVE, '')).toEqual('Live');
    expect(formatStatus(AccountStatus.ACTIVE, AccountRecordType.ARCHIVED, '')).toEqual('Archived');
    expect(formatStatus(AccountStatus.LOCKED, AccountRecordType.LIVE, '')).toEqual('Live but locked');
    expect(formatStatus(AccountStatus.SUSPENDED, AccountRecordType.LIVE, '')).toEqual('Live but suspended');
    expect(formatStatus('RANDOM' as unknown as AccountStatus, AccountRecordType.LIVE, 'default msg'))
      .toEqual('default msg');
    expect(formatStatus(AccountStatus.ACTIVE, 'RANDOM' as unknown as AccountRecordType, 'default msg'))
      .toEqual('default msg');
  });
});
