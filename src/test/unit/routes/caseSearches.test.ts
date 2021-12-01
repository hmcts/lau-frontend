import nock from 'nock';
import request from 'supertest';
import {app} from '../../../main/app';
import {CaseSearchesController} from '../../../main/controllers/case-searches.controller';

describe('Case Searches Route', () => {
  app.use('/case-searches/csv', (new CaseSearchesController()).getPage);

  it('responds with a CSV file', async () => {
    nock('http://localhost:4550')
      .get('/audit/caseSearch?')
      .reply(
        200,
        {searchLog: [], startRecordNumber: 1, moreRecords: false},
      );

    const res = await request(app).get('/case-searches/csv');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
  });
});
