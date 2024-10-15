import {csvJson} from '../../../main/util/CsvHandler';
import {CaseActivityLogs} from '../../../main/models/case/CaseActivityLogs';
import {CaseSearchLogs} from '../../../main/models/case/CaseSearchLogs';
import {CaseChallengedAccessLogs} from '../../../main/models/challenged-access/CaseChallengedAccessLogs';

const caseActivityAuditResponse = require('../../data/caseActivityAuditResponse.json');
const caseSearchAuditResponse = require('../../data/caseSearchAuditResponse.json');
const caseChallengedAccessResponse = require('../../data/caseChallengedAccessLogs.json');

describe('CsvHandler', () => {

  it('Converts Case View JSON object to CSV', async () => {
    const caseActivityLogs = new CaseActivityLogs(caseActivityAuditResponse.actionLog);
    expect(csvJson(caseActivityLogs)).toStrictEqual({
      'fields': [
        {
          'label': 'User Id',
          'value': 'userId',
        },
        {
          'label': 'Case Action',
          'value': 'caseAction',
        },
        {
          'label': 'Case Ref',
          'value': 'caseRef',
        },
        {
          'label': 'Case Jurisdiction Id',
          'value': 'caseJurisdictionId',
        },
        {
          'label': 'Case Type Id',
          'value': 'caseTypeId',
        },
        {
          'label': 'Timestamp (UTC)',
          'value': 'timestamp',
        },
      ],
      'data': [
        {
          'caseAction': 'VIEW',
          'caseJurisdictionId': 'Probate',
          'caseRef': '1615817621013640',
          'caseTypeId': 'Caveats',
          'timestamp': '2021-06-23 22:20:05',
          'userId': '3748238',
        },
        {
          'caseAction': 'VIEW',
          'caseJurisdictionId': 'Probate',
          'caseRef': '1615817621013640',
          'caseTypeId': 'Caveats',
          'timestamp': '2020-02-02 08:16:27',
          'userId': '3748239',
        },
      ],
    });
  });

  it('Converts Case Search JSON object to CSV', async () => {
    const caseSearchLogs = new CaseSearchLogs(caseSearchAuditResponse.searchLog);
    expect(csvJson(caseSearchLogs)).toStrictEqual({
      'fields': [
        {
          'label': 'User Id',
          'value': 'userId',
        },
        {
          'label': 'Case Refs',
          'value': 'caseRefs',
        },
        {
          'label': 'Timestamp (UTC)',
          'value': 'timestamp',
        },
      ],
      'data': [
        {
          'caseRefs': [
            '1615817621013640',
            '1615817621013643',
          ],
          'timestamp': '2021-06-23 22:20:05',
          'userId': '3748238',
        },
        {
          'caseRefs': [
            '1615817621013640',
          ],
          'timestamp': '2020-02-02 08:16:27',
          'userId': '3748239',
        },
      ],
    });
  });

  it('Converts Case Challenged Access JSON object to CSV', async () => {
    const caseChallengedAccessLogs = new CaseChallengedAccessLogs(caseChallengedAccessResponse.accessLog);
    expect(csvJson(caseChallengedAccessLogs)).toStrictEqual({
      'fields': [
        {
          'label': 'User ID',
          'value': 'userId',
        },
        {
          'label': 'Case ID',
          'value': 'caseRef',
        },
        {
          'label': 'Request Type',
          'value': 'requestType',
        },
        {
          'label': 'Action',
          'value': 'action',
        },
        {
          'label': 'Action On (UTC)',
          'value': 'timestamp',
        },
        {
          'label': 'Justification',
          'value': 'reason',
        },
        {
          'label': 'Time Limit (UTC)',
          'value': 'requestEndTimestamp',
        },
      ],
      'data': [
        {
          'caseRef': '123',
          'userId': '456',
          'requestType': 'challenged',
          'timestamp': '2020-07-20 15:00:00',
          'action': 'Created',
          'requestEndTimestamp': '2020-07-20 15:00:00',
          'reason': 'example reason',
        },
        {
          'caseRef': '123',
          'userId': '456',
          'requestType': 'specifc',
          'timestamp': '2020-07-20 15:00:00',
          'action': 'Created',
          'requestEndTimestamp': '2020-07-20 15:00:00',
          'reason': 'example reason',
        },
      ],
    });
  });
});
