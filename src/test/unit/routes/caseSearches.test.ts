import nock from 'nock';
import request from 'supertest';
import {app} from '../../../main/app';
import {CaseSearchesController} from '../../../main/controllers/CaseSearches.controller';

describe('Case Searches Route', () => {
  app.use('/case-searches/csv', (new CaseSearchesController()).getCsv);

  it('responds with a CSV file', async () => {
    nock('http://localhost:4550')
      .get('/audit/caseSearch?page=1&size=0')
      .reply(
        200,
        {searchLog: [], startRecordNumber: 1, moreRecords: false, totalNumberOfRecords: 0},
      );

    const res = await request(app).get('/case-searches/csv');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
  });
});
