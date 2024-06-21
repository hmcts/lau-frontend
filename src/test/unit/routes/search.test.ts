import { postRequest } from '../../helpers/post';

describe('Search Route', () => {

  describe('Case Audit', () => {
    it('Calls the Search Controller post method', async () => {
      const res = await postRequest('/case-search');
      expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
      expect(res.statusCode).toBe(302);
    });
  });

  describe('Logon Audit', () => {
    it('Calls the Search Controller post method', async () => {
      const res = await postRequest('/logon-search');
      expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
      expect(res.statusCode).toBe(302);
    });
  });

  describe('Case Deletions', () => {
    it('Calls the Case Deletions Controller post method', async () => {
      const res = await postRequest('/case-deletions-search');
      expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
      expect(res.statusCode).toBe(302);
    });
  });

  describe('Deleted Users Audit', () => {
    it('Calls the Search Controller post method', async () => {
      const res = await postRequest('/deleted-users-search');
      expect(res.header['content-type']).toBe('text/plain; charset=utf-8');
      expect(res.statusCode).toBe(302);
    });
  });

});
