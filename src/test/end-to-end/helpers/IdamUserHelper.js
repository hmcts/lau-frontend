const config = require('../../config.js');
const restHelper = require('./RestHelper.js');
const idamApiUrl = config.url.idamApi;
const testingEndpoint = `${idamApiUrl}/testing-support/accounts`;

const createAUser = async (userEmail, userPassword, roleName = 'cft-audit-investigator') => {
  process.env.USER_EMAIL = userEmail;
  process.env.USER_PASSWORD = userPassword;
  const requestBody = {
    email: userEmail,
    forename: 'TestForename',
    password: userPassword,
    surname: 'TestSurname',
    roles: [
      {code: roleName}
    ],
  };

  const response = await restHelper.retriedRequest(
    `${testingEndpoint}`,
    {
      'Content-Type': 'application/json'
    },
    JSON.stringify(requestBody),
    'POST'
  );

  return response.json();
};

const deleteUser = async (userEmail) => {
  return restHelper.retriedRequest(
    `${testingEndpoint}/${userEmail}`,
    {
      'Content-Type': 'application/json'
    },
    null,
    'DELETE'
  );
};

module.exports = {
  createAUser,
  deleteUser,
};