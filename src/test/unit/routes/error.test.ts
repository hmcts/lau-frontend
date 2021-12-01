import request from 'supertest';
import Error from '../../../main/routes/error';
import {app} from '../../../main/app';

describe('Error Route', () => {
  app.use('/', Error);

  it('renders the template', async () => {
    const res = await request(app).get('/error');
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Sorry, we&rsquo;re having technical problems');
  });
});
