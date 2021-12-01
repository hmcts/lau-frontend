import nock from 'nock';
import request from 'supertest';
import {app} from '../../../main/app';
import {CaseActivityController} from '../../../main/controllers/case-activity.controller';

describe('Case Activity Route', () => {
  app.use('/case-activity/csv', (new CaseActivityController()).getPage);

  it('responds with a CSV file', async () => {
    nock('http://localhost:4550')
      .get('/audit/caseAction?')
      .reply(
        200,
        {actionLog: [], startRecordNumber: 1, moreRecords: false},
      );

    const res = await request(app).get('/case-activity/csv');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
  });
});
