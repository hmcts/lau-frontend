import config from 'config';
import {AutoSuggestService} from '../../../main/service/AutoSuggestService';
import {AuthService} from '../../../main/service/AuthService';
import fs from 'fs';
import {ServiceAuthToken} from '../../../main/components/idam/ServiceAuthToken';
import {Response} from 'node-fetch';
import nock from 'nock';

describe('AutoSuggestService', () => {
  let authService = new AuthService(config);
  let service = new AutoSuggestService(authService, config);


  describe('loadData', () => {
    beforeEach(() => {
      authService = new AuthService(config);
      service = new AutoSuggestService(authService, config);
    });

    it('loads empty data in dev mode', () => {
      const data = JSON.stringify({jurisdictions: [], caseTypes: []});

      const spy = jest.spyOn(fs, 'readFile')
        .mockImplementation((_path: string, callback: (err: null, data: Buffer) => void) => {
          callback(null, Buffer.from(data));
        });

      service.loadData(true);
      expect(spy).toHaveBeenCalled();
      expect(service.getJurisdictionsData()).toEqual([{text: '', value: ''}]);
      expect(service.getCaseTypesData()).toEqual([{text: '', value: ''}]);
    });

    it('loads empty data in dev mode', () => {
      const data = JSON.stringify({
        jurisdictions: [
          {'text': 'PROBATE', 'value': 'PROBATE'},
          {'text': 'SSCS', 'value': 'SSCS'}],
        caseTypes: [{'text': 'caveat', 'value': 'caveat'}],
      });

      const spy = jest.spyOn(fs, 'readFile')
        .mockImplementation((_path: string, callback: (err: null, data: Buffer) => void) => {
          callback(null, Buffer.from(data));
        });

      service.loadData(true);
      expect(spy).toHaveBeenCalled();
      expect(service.getJurisdictionsData()).toEqual([
        {text: '', value: ''},
        {text: 'PROBATE', value: 'PROBATE'},
        {text: 'SSCS', value: 'SSCS'}]);
      expect(service.getCaseTypesData()).toEqual([
        {text: '', value: ''},
        {'text': 'caveat', 'value': 'caveat'},
      ]);
    });

    it('loads empty on data read failure', async () => {
      const spy = jest.spyOn(fs, 'readFile')
        .mockImplementation((_path: string, callback: (err: Error, data: null) => void) => {
          callback(new Error('read error'), null);
        });
      service.loadData(true);
      expect(spy).toHaveBeenCalled();
      expect(service.getJurisdictionsData()).toEqual([{text: '', value: ''}]);
      expect(service.getCaseTypesData()).toEqual([{text: '', value: ''}]);
    });

    it('loads data in production mode', async () => {
      const idamResponse = new Response(JSON.stringify({sub: 'lau_frontend', exp: 1634657845}));
      const dummyToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIwMzYyMzkwMjIsImlhdCI6MTcyNjIzOTAyMn0.5kCR7mm6DYI2f3BfoftxLMPOtpOpnzOj3V1Omuz9R84';
      const s2sToken = new ServiceAuthToken(dummyToken);
      jest.spyOn(authService, 'getIdAMResponse').mockResolvedValue(idamResponse);
      jest.spyOn(authService, 'retrieveServiceToken').mockResolvedValue(s2sToken);
      nock('http://ccd-definition-store-api-aat.service.core-compute-aat.internal')
        .get('/api/data/jurisdictions')
        .reply(200, [{'id': 'probate', 'case_types': [{id: 'legacy'}]}]);

      service.loadData(false);
      // give some time to resolve promises
      await new Promise(resolve => setTimeout(resolve, 200));

      expect(service.getJurisdictionsData()).toEqual([{text: '', value: ''}, {text: 'probate', value: 'probate'}]);
      expect(service.getCaseTypesData()).toEqual([{text: '', value: ''}, {text: 'legacy', value: 'legacy'}]);
    });

  });
});
