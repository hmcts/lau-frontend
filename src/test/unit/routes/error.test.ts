import request from 'supertest';
import Error from '../../../main/routes/error';
import {app} from '../../../main/app';
import { appInsights } from '../../../main/modules/appinsights';

describe('Error Route', () => {
  app.use('/', Error);

  it('renders the template', async () => {
    const res = await request(app).get('/error');
    expect(res.header['content-type']).toBe('text/html; charset=utf-8');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Sorry, we&rsquo;re having technical problems');
  });

  it('captures middleware errors in App Insights', async () => {
    const trackException = appInsights.trackException as jest.Mock;
    trackException.mockClear();

    const res = await request(app).post('/unknown-route');

    expect(res.statusCode).toBe(500);
    expect(trackException).toHaveBeenCalledWith(expect.any(TypeError), {
      method: 'POST',
      path: '/unknown-route',
      statusCode: 500,
    });
  });
});
