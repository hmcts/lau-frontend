import request from 'supertest';
import {app} from '../../../main/app';
import { setRoles } from '../../helpers/roles';

describe('Home Route', () => {

  it('redirects to /case-audit on home request', async () => {
    const agent = request.agent(app);
    const res = await agent.get('/');
    expect(res.statusCode).toBe(302);
    expect(res.header['location']).toBe('/case-audit');
  });

  it('renders the template with links to all pages given user has both cft roles', async () => {
    const agent = request.agent(app);

    await setRoles(agent, ['cft-audit-investigator', 'cft-service-logs']);
    const res = await agent.get('/case-audit');

    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Case audit');
    expect(res.text).toContain('Log ons audit');
    expect(res.text).toContain('Deleted users');
    expect(res.text).toContain('Case deletions');
    expect(res.text).toContain('Case audit search');
    expect(res.text).toContain('id="case-search-form"');
  });

  describe('Opens CFT audit investigator pages', () => {
    const agent = request.agent(app);

    it('renders the case-audit with content given user has audit investigator role', async () => {
      await setRoles(agent, ['cft-audit-investigator']);

      const res = await agent.get('/case-audit');

      expect(res.header['content-type']).toBe('text/html; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Case audit');
      expect(res.text).toContain('Log ons audit');
      expect(res.text).toContain('Deleted users');
      expect(res.text).toContain('id="case-search-form"');
      expect(res.text).toContain('Case audit search');
      expect(res.text).not.toContain('Case deletions');
    });

    it('renders the logons-audit with content given user has audit investigator role', async () => {
      const res = await agent.get('/logon-audit');

      await setRoles(agent, ['cft-audit-investigator']);

      expect(res.header['content-type']).toBe('text/html; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Case audit');
      expect(res.text).toContain('Log ons audit');
      expect(res.text).toContain('Deleted users');
      expect(res.text).toContain('id="logon-search-form"');
      expect(res.text).toContain('Log ons audit search');
      expect(res.text).not.toContain('Case deletions');
    });

    it('renders deleted users template with content given user has audit investigator role', async () => {
      const res = await agent.get('/user-deletion-audit');

      await setRoles(agent, ['cft-audit-investigator']);

      expect(res.header['content-type']).toBe('text/html; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain('Case audit');
      expect(res.text).toContain('Log ons audit');
      expect(res.text).toContain('Deleted users');
      expect(res.text).toContain('id="user-deletions-search-form"');
      expect(res.text).toContain('Deleted user search');
      expect(res.text).not.toContain('Case deletions');
    });
  });

  it('renders the template with content given user has service logs role', async () => {
    const agent = request.agent(app);

    await setRoles(agent, ['cft-service-logs']);

    const res = await agent.get('/case-deletion-audit');

    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).not.toContain('Case audit');
    expect(res.text).not.toContain('Log ons audit');
    expect(res.text).not.toContain('Deleted users');
    expect(res.text).toContain('Case deletions');
    expect(res.text).toContain('id="case-deletions-search-form"');
    expect(res.text).toContain('Deleted case search');
  });
});
