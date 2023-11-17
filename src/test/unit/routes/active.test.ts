import request from 'supertest';
import {app} from '../../../main/app';

describe('Active Route', () => {
  it('responds with nothing', async () => {
    const agent = request.agent(app);

    await agent
      .post('/set-session-user')
      .send({
        id: 'test',
        idToken: 'idToken',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiresAt: Date.now() + 1000 * 30,
        roles: ['cft-service-logs'],
      });

    const res = await agent.get('/active');

    expect(res.statusCode).toBe(200);
  });

  it('responds with redirect to logout', async() => {
    const agent = request.agent(app);
    const res = await agent.get('/active');

    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe('/logout');
  });

});
