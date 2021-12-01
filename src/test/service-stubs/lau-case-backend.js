'use strict';

/* eslint no-console: 0 */

const config = require('config');
const express = require('express');
const app = express();
const router = express.Router();
const BACKEND_PORT = config.get('services.case-backend.port');
const CASE_ACTIVITY_ENDPOINT = config.get('services.case-backend.endpoints.caseActivity');
const CASE_SEARCH_ENDPOINT = config.get('services.case-backend.endpoints.caseSearch');

const caseActivityLogs = require('../data/caseActivityLogs.json');
const caseSearchLogs = require('../data/caseSearchLogs.json');

app.use(express.json());

router.get('/health/readiness', (req, res) => {
  res.contentType('application/json');
  res.status(200);
  res.send({status: 'UP'});
});

router.get(CASE_ACTIVITY_ENDPOINT, (req, res) => {
  res.contentType('application/json');
  res.status(200);
  res.json(caseActivityLogs);
});

router.get(CASE_SEARCH_ENDPOINT, (req, res) => {
  res.contentType('application/json');
  res.status(200);
  res.json(caseSearchLogs);
});

app.use(router);

console.log(`Listening on: ${BACKEND_PORT}`);
const server = app.listen(BACKEND_PORT);

module.exports = server;
