import nock from 'nock';
import request from 'supertest';
import {app} from '../../../main/app';

describe('Deleted Users Audit Route', () => {
  it('responds with a CSV file', async () => {
    nock('http://localhost:4551')
      .get('/audit/deletedAccounts?page=1&size=0')
      .reply(
        200,
        {deletionLogs: [], totalNumberOfRecords: 0, startRecordNumber: 1, moreRecords: false },
      );

    const res = await request(app).get('/deleted-users/csv');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
  });
});
