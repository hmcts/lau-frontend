import {csvJson} from '../../../main/util/CsvHandler';
import {CaseActivityLogs} from '../../../main/models/case/CaseActivityLogs';
import {CaseSearchLogs} from '../../../main/models/case/CaseSearchLogs';

const caseActivityAuditResponse = require('../../data/caseActivityAuditResponse.json');
const caseSearchAuditResponse = require('../../data/caseSearchAuditResponse.json');

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
});
