import {numberWithCommas} from '../../../main/util/Util';

describe('Util', () => {
  describe('numberWithCommas', () => {
    interface TestData { value: string | number; expected: string; }

    it('adds commas to numbers correctly - string', () => {
      const testData: TestData[] = [
        { value: '100', expected: '100' },
        { value: '1000', expected: '1,000' },
        { value: '10000', expected: '10,000' },
        { value: '100000', expected: '100,000' },
      ];

      testData.forEach(data => expect(numberWithCommas(data.value)).toBe(data.expected));
    });

    it('adds commas to numbers correctly - number', () => {
      const testData: TestData[] = [
        { value: 100, expected: '100' },
        { value: 1000, expected: '1,000' },
        { value: 10000, expected: '10,000' },
        { value: 100000, expected: '100,000' },
      ];

      testData.forEach(data => expect(numberWithCommas(data.value)).toBe(data.expected));
    });

    it('handles NaN cases gracefully', () => {
      expect(numberWithCommas('abc123')).toBe('');
    });
  });
});
