import { app } from '../../main/app';

import * as supertest from 'supertest';
import pa11y from 'pa11y';
import { Server } from 'http';

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

function runPally(url: string): Promise<Results> {
  return pa11y(url, {
    hideElements: '.govuk-footer__licence-logo, .govuk-header__logotype-crown',
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
      await ensurePageCallWillSucceed(url);
      const result = await runPally('http://127.0.0.1:8888');
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
    server ? await server.close() : null;
  });

  testAccessibility('/');
  testAccessibility('/cookies');
});
