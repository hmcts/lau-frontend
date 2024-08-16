import nock from 'nock';
import sinon from 'sinon';
import {AppRequest} from '../../../main/models/appRequest';
import {DeletedUsersSearchController} from '../../../main/controllers/DeletedUsersSearch.controller';
import config from 'config';


describe('Deleted Users Search Controller', () => {
  describe('Search form validation', () => {
    const deletedUsersSearchController: DeletedUsersSearchController = new DeletedUsersSearchController();

    it('requires at least one of the string inputs', async () => {
      const errors = deletedUsersSearchController.validateSearchForm({
        userId: '',
        emailAddress: '',
        firstName: '',
        lastName: '',
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '2021-01-01T00:00:01',
        page: 1,
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'deletedUsersSearchForm', errorType: 'stringFieldRequired'});
    });

    it('requires both date inputs to be filled', async () => {
      let errors = deletedUsersSearchController.validateSearchForm({
        startTimestamp: '',
        endTimestamp: '',
      });
      expect(errors.length).toBe(2);
      expect(errors[0].errorType).toBe('required');
      expect(errors[1].errorType).toBe('required');

      errors = deletedUsersSearchController.validateSearchForm({
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'endTimestamp', errorType: 'required'});

      errors = deletedUsersSearchController.validateSearchForm({
        startTimestamp: '',
        endTimestamp: '2021-01-01T00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'required'});
    });
    
    it('ensures dates are valid', async () => {
      const errors = deletedUsersSearchController.validateSearchForm({
        startTimestamp: '2021-14-01 00:00:00',
        endTimestamp: '2021-12-01T00:00:00',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'startTimestamp', errorType: 'invalid'});
    });

    it('passes valid dates', async () => {
      const errors = deletedUsersSearchController.validateSearchForm({
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '2021-01-01T00:00:01',
      });
      expect(errors.length).toBe(0);
    });

    it('ensures email are in correct format', async () => {
      const errors = deletedUsersSearchController.validateSearchForm({
        emailAddress: 'test)test@test.com',
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '2021-01-01T00:00:01',
      });
      expect(errors.length).toBe(1);
      expect(errors[0]).toStrictEqual({propertyName: 'emailAddress', errorType: 'invalid'});
    });

    it('ensures email is valid', async () => {
      const errors = deletedUsersSearchController.validateSearchForm({
        emailAddress: 'test_test@test.com',
        startTimestamp: '2021-01-01T00:00:00',
        endTimestamp: '2021-01-01T00:00:01',
      });
      expect(errors.length).toBe(0);
    });
  });

  describe('Post call', () => {
    const deletedUsersSearchController: DeletedUsersSearchController = new DeletedUsersSearchController();
    const basePath: string = config.get('services.lau-idam-backend.url');

    const res = {
      redirect: sinon.spy(),
    };

    beforeEach(() => {
      nock.cleanAll();
      res.redirect.resetHistory();
    });

    it('formats the search request', async () => {
      nock(basePath)
        .get('/audit/deletedAccounts?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&page=1&size=5')
        .reply(
          200,
          {deletionLogs: []},
        );

      const req = {
        session: {},
        body: {
          userId: '123',
          emailAddress: '',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
          page: 1,
        },
      };

      // @ts-ignore
      return deletedUsersSearchController.post(req as AppRequest, res as Response).then(() => {
        expect(req.body).toStrictEqual({
          userId: '123',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
          page: 1,
          size: 5,
        });
      });
    });

    it('redirects to the deleted users results tab', async () => {
      nock(basePath)
        .get('/audit/deletedAccounts?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&size=5')
        .reply(
          200,
          {deletionLogs: []},
        );

      const req = {
        session: {},
        body: {
          userId: '123',
          emailAddress: '',
          firstName:'',
          lastName: '',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
        },
      };

      // @ts-ignore
      return deletedUsersSearchController.post(req as AppRequest, res as Response).then(() => {
        expect(res.redirect.calledOnce).toBeTruthy();
        expect(res.redirect.calledWith('/user-deletion-audit#results-section')).toBeTruthy();
      });
    });

    it('redirects to error page with backend error code', async () => {
      nock(basePath)
        .get('/audit/deletedAccounts?userId=123&startTimestamp=2021-12-12T12:00:00&endTimestamp=2021-12-12T12:00:01&size=5')
        .reply(500, {});

      const req = {
        session: {},
        body: {
          userId: '123',
          emailAddress: '',
          startTimestamp: '2021-12-12T12:00:00',
          endTimestamp: '2021-12-12T12:00:01',
        },
      };

      // @ts-ignore
      return deletedUsersSearchController.post(req as AppRequest, res as Response).then(() => {
        expect(res.redirect.calledOnce).toBeTruthy();
        expect(res.redirect.calledWith('/error?code=LAU03')).toBeTruthy();
      });
    });
  });
});
