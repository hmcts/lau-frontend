import request from 'supertest';
import Unauthorized from '../../../main/routes/unauthorized';
import {app} from '../../../main/app';

describe('Unauthorized Route', () => {
  app.use('/', Unauthorized);

  it('renders the template with content', async () => {
    const res = await request(app).get('/unauthorized');
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Unauthorized');
  });
});
