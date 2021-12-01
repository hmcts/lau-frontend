import {HttpResponseError} from '../../../main/util/HttpResponseError';
import {Response} from 'node-fetch';

describe('HttpResponseError', function () {
  it('forms the correct error string', () => {
    const response = new Response(null, {status: 500, statusText: 'Error'});
    const httpResponseError = new HttpResponseError(response);

    expect(httpResponseError.message).toBe('HTTP Error Response: 500 Error');
  });
});
