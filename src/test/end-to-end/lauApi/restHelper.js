const { retry } = require('./retryHelper');

/**
 * Make a retried HTTP request with automatic retry logic
 * @param {string} url - The URL to request
 * @param {object} headers - Request headers
 * @param {string|object} body - Request body (optional)
 * @param {string} method - HTTP method (default: 'POST' if body provided, 'GET' otherwise)
 * @returns {Promise<Response>}
 */
const retriedRequest = async (url, headers = {}, body = null, method = null) => {
  // Determine HTTP method if not specified
  const httpMethod = method || (body ? 'POST' : 'GET');

  return retry(() =>
    fetch(url, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...(body && { body: typeof body === 'string' ? body : JSON.stringify(body) }),
    })
  );
};

module.exports = {
  retriedRequest,
};
