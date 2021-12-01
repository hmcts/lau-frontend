import {
  atLeastOneFieldIsFilled,
  fillPartialTimestamp, isFilledIn,
  startDateBeforeEndDate,
  validDateInput,
} from '../../../main/util/validators';

describe('Validator', () => {

  describe('atLeastOneFieldIsFilled', () => {
    it('expects an object to be passed', async () => {
      const errorType = atLeastOneFieldIsFilled(null);
      expect(errorType).toBe('required');
    });

    it('returns error type if object is empty', async () => {
      const errorType = atLeastOneFieldIsFilled({});
      expect(errorType).toBe('required');
    });

    it('returns error type if all object properties are an empty string', async () => {
      const errorType = atLeastOneFieldIsFilled({userId: '', caseTypeId: '', caseRef: '', caseJurisdictionId: ''});
      expect(errorType).toBe('required');
    });

    it('does not return an error type if an object property has a non-empty string value', async () => {
      const errorType = atLeastOneFieldIsFilled({userId: '1', caseTypeId: '', caseRef: '', caseJurisdictionId: ''});
      expect(errorType).toBe(undefined);
    });
  });

  describe('validDateInput', () => {
    it('returns error type if the date string doesn\'t match the regex', async () => {
      const errorType = validDateInput('2021-01-01_00:00:00');
      expect(errorType).toBe('invalid');
    });

    it('returns error type if the date is invalid', async () => {
      const errorType = validDateInput('2021-14-01 00:00:00');
      expect(errorType).toBe('invalid');
    });

    it('doesn\'t return an error type if the date is valid', async () => {
      const errorType = validDateInput('2021-01-01 00:00:00');
      expect(errorType).toBe(undefined);
    });
  });

  describe('startDateBeforeEndDate', () => {
    it('doesn\'t return an error type if the date fields are not filled', async () => {
      let errorType = startDateBeforeEndDate({});
      expect(errorType).toBe(undefined);
      errorType = startDateBeforeEndDate({startTimestamp: ''});
      expect(errorType).toBe(undefined);
      errorType = startDateBeforeEndDate({endTimestamp: ''});
      expect(errorType).toBe(undefined);
    });

    it('doesn\'t return an error type if the dates are invalid', async () => {
      let errorType = startDateBeforeEndDate({startTimestamp: '2021-01-01T00:00:00', endTimestamp: '2021-01-01 00:00:00'});
      expect(errorType).toBe(undefined);

      errorType = startDateBeforeEndDate({startTimestamp: '2021-01-01 00:00:00', endTimestamp: '2021-01-01T00:00:00'});
      expect(errorType).toBe(undefined);
    });

    it('returns error type if the end date is before the start date or the same', async () => {
      let errorType = startDateBeforeEndDate({startTimestamp: '2021-01-01 00:00:01', endTimestamp: '2021-01-01 00:00:00'});
      expect(errorType).toBe('startDateBeforeEndDate');

      errorType = startDateBeforeEndDate({startTimestamp: '2021-01-01 00:00:00', endTimestamp: '2021-01-01 00:00:00'});
      expect(errorType).toBe('startDateBeforeEndDate');
    });

    it('doesn\'t return an error type if the dates are valid', async () => {
      const errorType = startDateBeforeEndDate({startTimestamp: '2021-01-01 00:00:00', endTimestamp: '2021-01-01 00:00:01'});
      expect(errorType).toBe(undefined);
    });
  });

  describe('isFilledIn', () => {
    it('returns error type if the field is an empty string', async () => {
      const errorType = isFilledIn('');
      expect(errorType).toBe('required');
    });

    it('returns error type if the field is null', async () => {
      const errorType = isFilledIn(null);
      expect(errorType).toBe('required');
    });

    it('doesn\'t return an error type if the field is filled ', async () => {
      const errorType = isFilledIn('filled');
      expect(errorType).toBe(undefined);
    });
  });

  describe('fillPartialTimestamp', () => {
    it('fills any partial timestamps', async () => {
      let date = fillPartialTimestamp('2021');
      expect(date).toBe('2021-01-01 00:00:00');

      date = fillPartialTimestamp('2021-02');
      expect(date).toBe('2021-02-01 00:00:00');

      date = fillPartialTimestamp('2021-02-02');
      expect(date).toBe('2021-02-02 00:00:00');

      date = fillPartialTimestamp('2021-02-02 12');
      expect(date).toBe('2021-02-02 12:00:00');

      date = fillPartialTimestamp('2021-02-02 12:12');
      expect(date).toBe('2021-02-02 12:12:00');
    });

    it('ignores invalid dates', async () => {
      const date = fillPartialTimestamp('2021_');
      expect(date).toBe('2021_');
    });
  });

});
