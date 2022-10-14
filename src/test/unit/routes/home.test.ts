import request from 'supertest';
import {app} from '../../../main/app';

describe('Home Route', () => {

  it('renders the template with content given user has both cft roles', async () => {
    const agent = request.agent(app);

    await agent
      .post('/set-session-user')
      .send({
        id: 'test',
        idToken: 'idToken',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiresAt: Date.now(),
        roles: ['cft-audit-investigator', 'cft-service-logs'],
      });

    const res = await agent.get('/');

    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Case Audit Search');
    expect(res.text).toContain('Case Activity');
    expect(res.text).toContain('Case Search');
    expect(res.text).toContain('Logons Audit Search');
    expect(res.text).toContain('Logons Results');
    expect(res.text).toContain('Case Deletions Search');
    expect(res.text).toContain('Case Deletions Results');
  });

  it('renders the template with content given user has audit investigator role', async () => {
    const agent = request.agent(app);

    await agent
      .post('/set-session-user')
      .send({
        id: 'test',
        idToken: 'idToken',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiresAt: Date.now(),
        roles: ['cft-audit-investigator'],
      });

    const res = await agent.get('/');

    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Case Audit Search');
    expect(res.text).toContain('Case Activity');
    expect(res.text).toContain('Case Search');
    expect(res.text).toContain('Logons Audit Search');
    expect(res.text).toContain('Logons Results');
    expect(res.text).not.toContain('Case Deletions Search');
    expect(res.text).not.toContain('Case Deletions Results');
  });

  it('renders the template with content given user has service logs role', async () => {
    const agent = request.agent(app);

    await agent
      .post('/set-session-user')
      .send({
        id: 'test',
        idToken: 'idToken',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
        expiresAt: Date.now(),
        roles: ['cft-service-logs'],
      });

    const res = await agent.get('/');

    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).not.toContain('Case Audit Search');
    expect(res.text).not.toContain('Case Activity');
    expect(res.text).not.toContain('Case Search');
    expect(res.text).not.toContain('Logons Audit Search');
    expect(res.text).not.toContain('Logons Results');
    expect(res.text).toContain('Case Deletions Search');
    expect(res.text).toContain('Case Deletions Results');
  });
});
