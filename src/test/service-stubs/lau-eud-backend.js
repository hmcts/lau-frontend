'use strict';

/* eslint no-console: 0 */

const config = require('config');
const express = require('express');
const app = express();
const router = express.Router();
const BACKEND_PORT = config.get('services.lau-eud-backend.port');
const USER_DETAILS_ENDPOINT = config.get('services.lau-eud-backend.endpoints.userDetails');

const userDetails = require('../data/userDetails.json');

app.use(express.json());

router.get('/health', (req, res) => {
  res.contentType('application/json');
  res.status(200);
  res.send({status: 'UP'});
});

router.get(USER_DETAILS_ENDPOINT, (req, res) => {
  res.contentType('application/json');
  res.status(200);

  res.json(userDetails);
});

app.use(router);

console.log(`Listening on: ${BACKEND_PORT}`);
const server = app.listen(BACKEND_PORT);

module.exports = server;
