import nock from 'nock';
import sinon from 'sinon';
import {CaseChallengedAccessSearchController} from '../../../main/controllers/CaseChallengedAccessSearch.controller';
import {AppRequest} from '../../../main/models/appRequest';
import { NextFunction } from 'express';

describe('Case Challenged Access Search Controller', () => {
  describe('Search form validation', () => {
    const searchController: CaseChallengedAccessSearchController = new CaseChallengedAccessSearchController();

    it('requires at least one of the string inputs', async () => {
      const errors = searchController.validateSearchForm({
        caseRef: '',
        userId: '',
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '2021-01-01T00:00:01',
        page: 1,
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'caseChallengedAccessSearchForm', errorType: 'stringFieldRequired'});
    });

    it('requires both date inputs to be filled', async () => {
      let errors = searchController.validateSearchForm({
        startTimestamp: '',
        endTimestamp: '',
      });
      expect(errors.length).toBe(2);
      expect(errors[0].errorType).toBe('required');
      expect(errors[1].errorType).toBe('required');

      errors = searchController.validateSearchForm({
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'endTimestamp', errorType: 'required'});

      errors = searchController.validateSearchForm({
        startTimestamp: '',
        endTimestamp: '2021-01-01T00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'required'});
    });

    it('ensures dates are valid', async () => {
      const errors = searchController.validateSearchForm({
        startTimestamp: '2021-14-01 00:00:00',
        endTimestamp: '2021-12-01T00:00:01',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'invalid'});
    });

    it('passes valid dates', async () => {
      const errors = searchController.validateSearchForm({
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '2021-01-01T00:00:01',
      });
      expect(errors.length).toBe(0);
    });

  });

  describe('Post call', () => {
    const searchController: CaseChallengedAccessSearchController = new CaseChallengedAccessSearchController();

    const res = {
      redirect: sinon.spy(),
    };

    beforeEach(() => {
      res.redirect.resetHistory();
    });

    it('formats the search request', async () => {
      nock('http://localhost:4550')
        .get('/audit/accessRequest?caseRef=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1&size=5')
        .reply(
          200,
          {accessLog: []},
        );

      const req = {
        session: {},
        body: {
          caseRef: '123',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
          page: 1,
          size: 5,
        },
      };

      // @ts-ignore
      return searchController.post(req as AppRequest, res as Response).then(() => {
        expect(req.body).toStrictEqual({
          caseRef: '123',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
          page: 1,
          size: 5,
        });
        nock.cleanAll();
      });
    });

    it('redirects to the results section', async () => {
      nock('http://localhost:4550')
        .get('/audit/accessRequest?caseRef=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&size=5')
        .reply(
          200,
          {accessLog: []},
        );

      const req = {
        session: {},
        body: {
          caseRef: '123',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
        },
      };

      const res = {
        redirect: jest.fn() as NextFunction,
      };

      // @ts-ignore
      return searchController.post(req as AppRequest, res as Response).then(() => {
        expect(res.redirect).toHaveBeenCalledWith('/challenged-specific-access');
        nock.cleanAll();
      });
    });

    it('redirects to error page with backend error code', async () => {
      nock('http://localhost:4550')
        .get('/audit/accessRequest?caseRef=1234567891234567&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01')
        .reply(function (url, body, cb) {
          cb(null, [400, {}]);
        });

      const req = {
        session: {},
        body: {
          caseRef: '1234567891234567',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
        },
      };

      const res = {
        redirect: jest.fn() as NextFunction,
      };

      // @ts-ignore
      return searchController.post(req as AppRequest, res as Response).then(() => {
        expect(res.redirect).toHaveBeenCalledWith('/error?code=LAU02');
        nock.cleanAll();
      });
    });
  });
});
