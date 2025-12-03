import nock from 'nock';
import request from 'supertest';
import {app} from '../../../main/app';
import caseChallengedAccessLogs from '../../data/caseChallengedAccessLogs.json';

describe('Case Challenged Access Route', () => {
  const agent = request(app);

  it('responds with a CSV file', async () => {
    nock('http://localhost:4550')
      .get('/audit/accessRequest?page=1&size=0')
      .reply(
        200,
        caseChallengedAccessLogs,
      );

    const res = await agent.get('/challenged-specific-access/csv');
    expect(res.header['content-type']).toBe('application/json; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe('application/json');
    nock.cleanAll();
  });
});
