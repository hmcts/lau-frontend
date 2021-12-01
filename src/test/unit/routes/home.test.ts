import request from 'supertest';
import Home from '../../../main/routes/home';
import {app} from '../../../main/app';

describe('Home Route', () => {
  app.use('/', Home);

  it('renders the template with content', async () => {
    const res = await request(app).get('/');

    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Case Audit Search');
    expect(res.text).toContain('Case Activity');
    expect(res.text).toContain('Case Searches');
    expect(res.text).toContain('Logons Audit Search');
    expect(res.text).toContain('Logons Results');
  });
});
