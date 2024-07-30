import config from 'config';
import {CaseTypeJurisdictionAutoSuggest} from '../../../main/service/CaseTypeJurisdictionAutoSuggest';
import fs from 'fs';

describe('AutoSuggestService', () => {

  let service = new CaseTypeJurisdictionAutoSuggest(config);

  describe('loadData', () => {
    beforeEach(() => {
      service = new CaseTypeJurisdictionAutoSuggest(config);
    });

    it('loads data in dev mode', () => {
      const data = JSON.stringify([
        {jurisdiction: 'PROBATE', caseType: 'LEGACYSEARCH'},
        {jurisdiction: 'PROBATE', caseType: 'CAVEAT'},
        {jurisdiction: 'CIVIL', caseType: 'CIVIL'},
      ]);

      const spy = jest.spyOn(fs, 'readFile')
        .mockImplementation((_path: string, callback: (err: null, data: Buffer) => void) => {
          callback(null, Buffer.from(data));
        });

      service.loadData();
      expect(spy).toHaveBeenCalled();
      expect(service.getJurisdictionsData()).toEqual([
        {text: '', value: ''},
        {text: 'PROBATE', value: 'PROBATE'},
        {text: 'CIVIL', value: 'CIVIL'}]);
      expect(service.getCaseTypesData()).toEqual([
        {text: '', value: ''},
        {'text': 'LEGACYSEARCH', 'value': 'LEGACYSEARCH'},
        {'text': 'CAVEAT', 'value': 'CAVEAT'},
        {'text': 'CIVIL', 'value': 'CIVIL'},
      ]);
    });

    it('loads empty on data read failure', async () => {
      const spy = jest.spyOn(fs, 'readFile')
        .mockImplementation((_path: string, callback: (err: Error, data: null) => void) => {
          callback(new Error('read error'), null);
        });
      service.loadData();
      expect(spy).toHaveBeenCalled();
      expect(service.getJurisdictionsData()).toEqual([{text: '', value: ''}]);
      expect(service.getCaseTypesData()).toEqual([{text: '', value: ''}]);
    });

  });
});
