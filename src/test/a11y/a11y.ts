import { app } from '../../main/app';
import fs from 'fs';
import * as supertest from 'supertest';
import pa11y from 'pa11y';
import { Server } from 'http';
import { setRoles } from './../helpers/roles';
const config = require('./pa11y-config.json');

interface Results {
  documentTitle: string;
  pageUrl: string;
  issues: ResultIssue[];
}

interface ResultIssue {
  code: string;
  context: string;
  message: string;
  selector: string;
  type: string;
  typeCode: number;
}

const agent = supertest.agent(app);
const baseUrl = 'http://127.0.0.1:8888';

function ensurePageCallWillSucceed(url: string): Promise<void> {
  return agent.get(url).then((res: supertest.Response) => {
    if (res.redirect) {
      throw new Error(`Call to ${url} resulted in a redirect to ${res.get('Location')}`);
    }
    if (res.serverError) {
      throw new Error(`Call to ${url} resulted in internal server error`);
    }
  });
}

function runPally(url: string, cookies: string = ''): Promise<Results> {
  const fullurl = `${baseUrl}${url}`;
  const screenshotDir = `${__dirname}/../../../functional-output/pa11y`;
  fs.mkdirSync(screenshotDir, { recursive: true });
  let filename = fullurl.replace(/https?:\/\//gi, '').replace(/[^a-zA-Z0-9.-]/g, '_');

  return pa11y(fullurl, {
    hideElements: '.govuk-footer__licence-logo, .govuk-header__logotype-crown',
    screenCapture: `${screenshotDir}/${filename}.png`,
    wait: 500,
    headers: {
      cookie: cookies,
    },
    ...config,
  });
}




function expectNoErrors(messages: ResultIssue[]): void {
  const errors = messages.filter(m => m.type === 'error');

  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    throw new Error(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}

function testAccessibility(url: string): void {
  describe(`Page ${url}`, () => {
    test('should have no accessibility errors', async () => {
      const setRoleResponse = await setRoles(agent, ['cft-audit-investigator', 'cft-service-logs']);
      const cookies = setRoleResponse.headers['set-cookie'][0];
      await ensurePageCallWillSucceed(url);
      const result = await runPally(url, cookies);
      expect(result.issues).toEqual(expect.any(Array));
      expectNoErrors(result.issues);
    }, 10000);
  });
}

describe('Accessibility', () => {

  let server: Server = null;

  beforeAll(async () => {
    await new Promise(resolve => {
      server = app.listen(8888, () => {
        resolve(true);
      });
    });

  });

  afterAll(async () => {
    if (server) {
      await server.close();
    }
  });

  // requires user session
  testAccessibility('/case-audit');
  testAccessibility('/logon-audit');
  testAccessibility('/user-deletion-audit');
  testAccessibility('/case-deletion-audit');

  // accessable without user session
  testAccessibility('/accessibility');
  testAccessibility('/cookies');
  testAccessibility('/privacy');
  testAccessibility('/terms-and-conditions');

});
