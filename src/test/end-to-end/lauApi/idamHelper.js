const config = require('../../config.js');
const restHelper = require('./restHelper');

const loginEndpoint = 'loginUser';
const idamUrl = config.url.idamApi;

module.exports = {
  accessToken: async (user) => {
    return restHelper.retriedRequest(
      `${idamUrl}/${loginEndpoint}?username=${encodeURIComponent(user.email)}&password=${user.password}`,
      {'Content-Type': 'application/x-www-form-urlencoded'})
      .then(response => response.json())
      .then(data => data.access_token);
  },

  userId: async (authToken) => {
    return restHelper.retriedRequest(
      `${idamUrl}/o/userinfo`,
      {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${authToken}`,
      })
      .then(response => response.json())
      .then(data => data.uid);
  },

  getPin: async (letterHolderId) => {
    return restHelper.retriedRequest(
      `${idamUrl}/testing-support/accounts/pin/${letterHolderId}`,
      {}, null, 'GET')
      .then(response => response.text());
  },
};
