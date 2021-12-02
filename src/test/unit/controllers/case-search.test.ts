import nock from 'nock';
import sinon from 'sinon';
import {CaseSearchController} from '../../../main/controllers/CaseSearch.controller';
import {AppRequest} from '../../../main/models/appRequest';

describe('Case Search Controller', () => {
  describe('Search form validation', () => {
    const searchController: CaseSearchController = new CaseSearchController();

    it('requires at least one of the string inputs', async () => {
      const errors = searchController.validateSearchForm({
        caseTypeId: '',
        caseJurisdictionId: '',
        caseRef: '',
        userId: '',
        startTimestamp: '2021-01-01 00:00:00',
        endTimestamp: '2021-01-01 00:00:01',
        page: 1,
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'caseSearchForm', errorType: 'stringFieldRequired'});
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
        startTimestamp: '2021-01-01 00:00:00',
        endTimestamp: '',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'endTimestamp', errorType: 'required'});

      errors = searchController.validateSearchForm({
        startTimestamp: '',
        endTimestamp: '2021-01-01 00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'required'});
    });

    it('ensures dates are formatted correctly', async () => {
      const errors = searchController.validateSearchForm({
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '2021-01-01 00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'invalid'});
    });

    it('ensures dates are valid', async () => {
      const errors = searchController.validateSearchForm({
        startTimestamp: '2021-14-01 00:00:00',
        endTimestamp: '2021-12-01 00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'invalid'});
    });

    it('passes valid dates', async () => {
      const errors = searchController.validateSearchForm({
        startTimestamp: '2021-01-01 00:00:00',
        endTimestamp: '2021-01-01 00:00:01',
      });
      expect(errors.length).toBe(0);
    });
  });

  describe('Post call', () => {
    const searchController: CaseSearchController = new CaseSearchController();

    const res = {
      redirect: sinon.spy(),
    };

    beforeEach(() => {
      res.redirect.resetHistory();
    });

    it('formats the search request', async () => {
      const req = {
        session: {},
        body: {
          userId: '123',
          caseRef: '',
          caseTypeId: '',
          caseJurisdictionId: '',
          startTimestamp: '2021-12-12 12:00:00',
          endTimestamp: '2021-12-12 12:00:01',
          page: 1,
        },
      };

      // @ts-ignore
      return searchController.post(req as AppRequest, res as Response).then(() => {
        expect(req.body).toStrictEqual({
          userId: '123',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
          page: 1,
          size: 5,
        });
      });
    });

    it('redirects to the case activity tab', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseAction?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&size=5')
        .reply(
          200,
          {actionLog: []},
        );
      nock('http://localhost:4550')
        .get('/audit/caseSearch?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&size=5')
        .reply(
          200,
          {searchLog: []},
        );

      const req = {
        session: {},
        body: {
          userId: '123',
          caseRef: '',
          caseTypeId: '',
          caseJurisdictionId: '',
          startTimestamp: '2021-12-12 12:00:00',
          endTimestamp: '2021-12-12 12:00:01',
        },
      };

      // @ts-ignore
      return searchController.post(req as AppRequest, res as Response).then(() => {
        expect(res.redirect.calledOnce).toBeTruthy();
        expect(res.redirect.calledWith('/#case-activity-tab')).toBeTruthy();
        nock.cleanAll();
      });
    });
  });
});
