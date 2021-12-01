'use strict';

/* eslint no-console: 0 */

const config = require('config');
const express = require('express');
const app = express();
const router = express.Router();
const BACKEND_PORT = config.get('services.idam-backend.port');
const LOGON_ENDPOINT = config.get('services.idam-backend.endpoints.logon');

const logonLogs = require('../data/logonLogs.json');

app.use(express.json());

router.get('/health/readiness', (req, res) => {
  res.contentType('application/json');
  res.status(200);
  res.send({status: 'UP'});
});

router.get(LOGON_ENDPOINT, (req, res) => {
  res.contentType('application/json');
  res.status(200);
  res.json(logonLogs);
});

app.use(router);

console.log(`Listening on: ${BACKEND_PORT}`);
const server = app.listen(BACKEND_PORT);

module.exports = server;
