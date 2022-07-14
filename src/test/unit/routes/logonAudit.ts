import nock from 'nock';
import request from 'supertest';
import {app} from '../../../main/app';

describe('Logon Audit Route', () => {
  it('responds with a CSV file', async () => {
    nock('http://localhost:4551')
      .get('/audit/logon?page=1&size=0')
      .reply(
        200,
        {logonLog: [], startRecordNumber: 1, moreRecords: false, totalNumberOfRecords: 0},
      );

    const res = await request(app).get('/logons/csv');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
  });
});
