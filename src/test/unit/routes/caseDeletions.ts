import nock from 'nock';
import request from 'supertest';
import {app} from '../../../main/app';
import config from 'config';

describe('Case Deletions Route', () => {
  const baseApiUrl = config.get('services.lau-case-backend.url') as string;
  const caseDeletionsEndpoint = config.get('services.lau-case-backend.endpoints.caseActivity') as string;

  it('responds with a CSV file', async () => {
    nock(baseApiUrl)
      .get(`${caseDeletionsEndpoint}?page=1&size=0`)
      .reply(
        200,
        {actionLog: [], startRecordNumber: 1, moreRecords: false, totalNumberOfRecords: 0},
      );

    const res = await request(app).get('/case-deletions/csv');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
  });
});
