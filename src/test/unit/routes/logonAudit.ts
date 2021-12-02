import nock from 'nock';
import request from 'supertest';
import {app} from '../../../main/app';
import {LogonController} from '../../../main/controllers/Logon.controller';

describe('Logon Audit Route', () => {
  app.use('/logons/csv', (new LogonController()).getPage);

  it('responds with a CSV file', async () => {
    nock('http://localhost:4551')
      .get('/audit/logon?')
      .reply(
        200,
        {logonLog: [], startRecordNumber: 1, moreRecords: false},
      );

    const res = await request(app).get('/logons/csv');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
  });
});
