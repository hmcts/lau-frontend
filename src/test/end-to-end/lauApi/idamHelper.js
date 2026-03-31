const { update } = require('lodash');
const config = require('../../config.js');
const restHelper = require('./restHelper');

const loginEndpoint = 'loginUser';
const idamUrl = config.url.idamApi;

module.exports = {

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

  createUser: async (accessToken, userEmail,userPassword, role = 'cft-audit-investigator') => {
    let userPayload = {
        password: userPassword,
        user: {
          email: userEmail,
          forename: "TestForename",
          surname: "TestSurname",
          roleNames: [role]
        }
      }
    return restHelper.retriedRequest(
      `${idamUrl}/api/v2/users`,
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      JSON.stringify(userPayload),
      'POST'
    ) .then(response => response.json())
      .then(data => data);
  },

  deleteUser: async (accessToken, userId) => {
    return restHelper.retriedRequest(
      `${idamUrl}/api/v2/users/${userId}`,
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      null,
      'DELETE'
    ) 
  },
}; 
