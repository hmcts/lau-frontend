import nock from 'nock';
import sinon from 'sinon';
import {AppRequest} from '../../../main/models/appRequest';
import {CaseDeletionsSearchController} from '../../../main/controllers/CaseDeletionsSearch.controller';
import {DeletionModes} from '../../../main/models/deletions/CaseDeletionsSearchRequest';

describe('Case Deletions Search Controller', () => {
  describe('Search form validation', () => {
    const caseDeletionsSearchController: CaseDeletionsSearchController = new CaseDeletionsSearchController();

    it('requires at least one of the string inputs', async () => {
      const errors = caseDeletionsSearchController.validateSearchForm({
        caseJurisdictionId: '',
        // @ts-ignore
        deletionMode: '',
        startTimestamp: '2021-01-01 00:00:00',
        endTimestamp: '2021-01-01 00:00:01',
        page: 1,
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'caseDeletionsSearchForm', errorType: 'stringFieldRequired'});
    });

    it('requires both date inputs to be filled', async () => {
      let errors = caseDeletionsSearchController.validateSearchForm({
        startTimestamp: '',
        endTimestamp: '',
      });
      expect(errors.length).toBe(2);
      expect(errors[0].errorType).toBe('required');
      expect(errors[1].errorType).toBe('required');

      errors = caseDeletionsSearchController.validateSearchForm({
        startTimestamp: '2021-01-01 00:00:00',
        endTimestamp: '',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'endTimestamp', errorType: 'required'});

      errors = caseDeletionsSearchController.validateSearchForm({
        startTimestamp: '',
        endTimestamp: '2021-01-01 00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'required'});
    });

    it('ensures dates are formatted correctly', async () => {
      const errors = caseDeletionsSearchController.validateSearchForm({
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '2021-01-01 00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'invalid'});
    });

    it('ensures dates are valid', async () => {
      const errors = caseDeletionsSearchController.validateSearchForm({
        startTimestamp: '2021-14-01 00:00:00',
        endTimestamp: '2021-12-01 00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'invalid'});
    });

    it('passes valid dates', async () => {
      const errors = caseDeletionsSearchController.validateSearchForm({
        startTimestamp: '2021-01-01 00:00:00',
        endTimestamp: '2021-01-01 00:00:01',
      });
      expect(errors.length).toBe(0);
    });
  });

  describe('Post call', () => {
    const caseDeletionsSearchController: CaseDeletionsSearchController = new CaseDeletionsSearchController();

    const res = {
      redirect: sinon.spy(),
    };

    beforeEach(() => {
      nock.cleanAll();
      res.redirect.resetHistory();
    });

    it('formats the search request', async () => {
      nock('http://localhost:4551')
        .get('/audit/caseDeletions?caseJurisdictionId=test&deletionMode=ALL=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1&size=5')
        .reply(
          200,
          {deletionsLog: []},
        );

      const req = {
        session: {},
        body: {
          caseJurisdictionId: 'test',
          deletionMode: DeletionModes.ALL,
          startTimestamp: '2021-12-12 12:00:00',
          endTimestamp: '2021-12-12 12:00:01',
          page: 1,
        },
      };

      // @ts-ignore
      return caseDeletionsSearchController.post(req as AppRequest, res as Response).then(() => {
        expect(req.body).toStrictEqual({
          caseJurisdictionId: 'test',
          deletionMode: 'ALL',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
          page: 1,
          size: 5,
        });
      });
    });

    it('redirects to the case deletions results tab', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseDeletions?deletionMode=ALL&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&size=5')
        .reply(
          200,
          {deletionsLog: []},
        );

      const req = {
        session: {},
        body: {
          deletionMode: 'ALL',
          startTimestamp: '2021-12-12 12:00:00',
          endTimestamp: '2021-12-12 12:00:01',
        },
      };

      // @ts-ignore
      return caseDeletionsSearchController.post(req as AppRequest, res as Response).then(() => {
        expect(res.redirect.calledOnce).toBeTruthy();
        expect(res.redirect.calledWith('/#case-deletions-tab')).toBeTruthy();
      });
    });

    it('redirects to error page with backend error code', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseDeletions?deletionMode=ALL&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&size=5')
        .reply(500, {});

      const req = {
        session: {},
        body: {
          deletionMode: 'ALL',
          startTimestamp: '2021-12-12 12:00:00',
          endTimestamp: '2021-12-12 12:00:01',
        },
      };

      // @ts-ignore
      return caseDeletionsSearchController.post(req as AppRequest, res as Response).then(() => {
        expect(res.redirect.calledOnce).toBeTruthy();
        expect(res.redirect.calledWith('/error?code=LAU02')).toBeTruthy();
      });
    });
  });
});
