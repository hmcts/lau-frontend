import nock from 'nock';
import sinon from 'sinon';
import {AppRequest} from '../../../main/models/appRequest';
import {CaseDeletionsSearchController} from '../../../main/controllers/CaseDeletionsSearch.controller';

describe('Case Deletions Search Controller', () => {
  describe('Search form validation', () => {
    const caseDeletionsSearchController: CaseDeletionsSearchController = new CaseDeletionsSearchController();

    it('requires at least one of the string inputs', async () => {
      const errors = caseDeletionsSearchController.validateSearchForm({
        caseRef: '',
        caseTypeId: '',
        caseJurisdictionId: '',
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '2021-01-01T00:00:01',
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
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'endTimestamp', errorType: 'required'});

      errors = caseDeletionsSearchController.validateSearchForm({
        startTimestamp: '',
        endTimestamp: '2021-01-01T00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'required'});
    });

    it('ensures dates are valid', async () => {
      const errors = caseDeletionsSearchController.validateSearchForm({
        startTimestamp: '2021-14-01 00:00:00',
        endTimestamp: '2021-12-01T00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'invalid'});
    });

    it('passes valid dates', async () => {
      const errors = caseDeletionsSearchController.validateSearchForm({
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '2021-01-01T00:00:01',
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
      nock('http://localhost:4550')
        .get('/audit/caseAction?caseRef=123&caseTypeId=123&caseJurisdictionId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1&caseAction=DELETE&size=5')
        .reply(
          200,
          {actionLog: []},
        );

      const req = {
        session: {},
        body: {
          caseRef: '123',
          caseTypeId: '123',
          caseJurisdictionId: '123',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
          page: 1,
        },
      };

      // @ts-ignore
      return caseDeletionsSearchController.post(req as AppRequest, res as Response).then(() => {
        expect(req.body).toStrictEqual({
          caseAction: 'DELETE',
          caseRef: '123',
          caseTypeId: '123',
          caseJurisdictionId: '123',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
          page: 1,
          size: 5,
        });
      });
    });

    it('redirects to the case deletions results tab', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseAction?caseRef=123&caseTypeId=123&caseJurisdictionId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&caseAction=DELETE&size=5')
        .reply(
          200,
          {actionLog: []},
        );

      const req = {
        session: {},
        body: {
          caseRef: '123',
          caseTypeId: '123',
          caseJurisdictionId: '123',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
        },
      };

      // @ts-ignore
      return caseDeletionsSearchController.post(req as AppRequest, res as Response).then(() => {
        expect(res.redirect.calledOnce).toBeTruthy();
        expect(res.redirect.calledWith('/case-deletion-audit#results-section')).toBeTruthy();
      });
    });

    it('redirects to error page with backend error code', async () => {
      nock('http://localhost:4550')
        .get('/audit/caseAction?caseRef=123&caseTypeId=123&caseJurisdictionId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&caseAction=DELETE&size=5')
        .reply(500, {});

      const req = {
        session: {},
        body: {
          caseRef: '123',
          caseTypeId: '123',
          caseJurisdictionId: '123',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
        },
      };

      // @ts-ignore
      return caseDeletionsSearchController.post(req as AppRequest, res as Response).then(() => {
        expect(res.redirect.calledOnce).toBeTruthy();
        expect(res.redirect.calledWith('/error?code=LAU02')).toBeTruthy();
      });
    });

    it('sanitizes string fields in the case deletions search request', async () => {
      const dirtyCaseRef = ' xyz !@# _456';
      const sanitizedCaseRef = 'xyz_456';

      nock('http://localhost:4550')
        .get(`/audit/caseAction?caseRef=${sanitizedCaseRef}&caseTypeId=123&caseJurisdictionId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&caseAction=DELETE&size=5`)
        .reply(
          200,
          {actionLog: []},
        );

      const req = {
        session: {},
        body: {
          caseRef: dirtyCaseRef,
          caseTypeId: '123',
          caseJurisdictionId: '123',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
          page: 1,
        },
      };

      // @ts-ignore
      return caseDeletionsSearchController.post(req as AppRequest, res as Response).then(() => {
        expect(req.body.caseRef).toBe(sanitizedCaseRef);
      });
    });
  });
});
