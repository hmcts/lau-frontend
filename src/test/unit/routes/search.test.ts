import request from 'supertest';
import Search from '../../../main/routes/search';
import {app} from '../../../main/app';

describe('Search Route', () => {
  app.use('/search', Search);

  describe('Case Audit', () => {
    it('Calls the Search Controller post method', async () => {
      const res = await request(app).post('/case-search');
      expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
      expect(res.statusCode).toBe(302);
    });
  });

  describe('Logon Audit', () => {
    it('Calls the Search Controller post method', async () => {
      const res = await request(app).post('/logon-search');
      expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
      expect(res.statusCode).toBe(302);
    });
  });
});
