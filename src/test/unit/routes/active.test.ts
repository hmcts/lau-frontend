import request from 'supertest';
import {app} from '../../../main/app';
import { setRoles } from '../../helpers/roles';

describe('Active Route', () => {
  it('responds with nothing', async () => {
    const agent = request.agent(app);

    await setRoles(agent, ['cft-service-logs'], {
      expiresAt: Date.now() + 1000 * 30,
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
