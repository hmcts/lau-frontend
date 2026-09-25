import type {Application} from 'express';

import {registerRoutes} from '../../../main/routes';

describe('route registry', () => {
  test('registers every GET and POST route', () => {
    const get = jest.fn();
    const post = jest.fn();

    const app = {
      get,
      post,
    } as unknown as Application;

    registerRoutes(app);

    expect(get.mock.calls.map(([path]) => path)).toEqual([
      '/accessibility',
      '/active',
      '/case-activity/page/:pageNumber',
      '/case-activity/csv',
      '/case-searches/page/:pageNumber',
      '/case-searches/csv',
      '/challenged-specific-access/page/:pageNumber',
      '/challenged-specific-access/csv',
      '/case-deletions/page/:pageNumber',
      '/case-deletions/csv',
      '/cookies',
      '/deleted-users/page/:pageNumber',
      '/deleted-users/csv',
      '/error',
      '/',
      '/case-audit',
      '/logon-audit',
      '/user-deletion-audit',
      '/case-deletion-audit',
      '/challenged-specific-access',
      '/user-details-audit',
      '/logons/page/:pageNumber',
      '/logons/csv',
      '/privacy',
      '/terms-and-conditions',
      '/unauthorized',
    ]);

    expect(post.mock.calls.map(([path]) => path)).toEqual([
      '/user-details-search/pdf',
      '/case-search',
      '/logon-search',
      '/case-deletions-search',
      '/deleted-users-search',
      '/challenge-access-search',
      '/user-details-search',
    ]);
  });
});
