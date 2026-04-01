const { update } = require('lodash');
const config = require('../../config.js');
const restHelper = require('./restHelper');

const loginEndpoint = 'loginUser';
const idamUrl = config.url.idamApi;

module.exports = {

  accessToken: async (user) => {
    return restHelper.retriedRequest(
      `${idamUrl}/${loginEndpoint}?username=${encodeURIComponent(user.email)}&password=${user.password}`,
      {'Content-Type': 'application/x-www-form-urlencoded'},
      null,
      'POST')
      .then(response => response.json())
      .then(data => data.access_token);
  },

  userId: async (authToken) => {
    return restHelper.retriedRequest(
      `${idamUrl}/o/userinfo`,
      {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${authToken}`,
      },
      null,
      'POST')
      .then(response => response.json())
      .then(data => data.uid);
  },

  getPin: async (letterHolderId) => {
    return restHelper.retriedRequest(
      `${idamUrl}/testing-support/accounts/pin/${letterHolderId}`,
      {}, null, 'GET')
      .then(response => response.text());
  },

  clientCredentialsAccessToken: async(idamClientSecret,scope) => {
    return restHelper.retriedRequest(
      `${idamUrl}/o/token`,
      {'Content-Type': 'application/x-www-form-urlencoded'},
      `grant_type=client_credentials&client_id=lau&client_secret=${idamClientSecret}&scope=${scope}`,
      'POST')
      .then(response => response.json())
      .then(data => data.access_token);
  },

  updateUserDetails: async (accessToken, userId, userEmail) => {
    return restHelper.retriedRequest(
      `${idamUrl}/api/v2/users/${userId}`,
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      JSON.stringify({ email: userEmail, forename: "TestForename", surname: "TestSurname"}),
      'PUT'
    );
  },
}; 
