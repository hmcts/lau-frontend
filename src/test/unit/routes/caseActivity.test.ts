import nock from 'nock';
import request from 'supertest';
import {app} from '../../../main/app';

describe('Case Activity Route', () => {
  const agent = request(app);

  it('responds with a CSV file', async () => {
    nock('http://localhost:4550')
      .get('/audit/caseAction?page=1&size=0')
      .reply(
        200,
        {actionLog: [], startRecordNumber: 1, moreRecords: false, totalNumberOfRecords: 0},
      );

    const res = await agent.get('/case-activity/csv');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
  });
});
