import request from 'supertest';
import Cookies from '../../../main/routes/cookies';
import {app} from '../../../main/app';

describe('Cookies Route', () => {
  app.use('/', Cookies);

  it('renders the template with content', async () => {
    const res = await request(app).get('/cookies');
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Cookies on Log and Audit');
  });
});
