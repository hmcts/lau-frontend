import {formatDate, formDateToRequestDate} from '../../../main/util/Date';

describe('formatDate', () => {
  it('formats an ISO date string', () => {
    expect(formatDate('2025-10-15T10:00:00.000Z')).toBe('2025-10-15 10:00:00');
  });

  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('');
  });
});

describe('formDateToRequestDate', () => {
  it('adds seconds when missing', () => {
    expect(formDateToRequestDate('2025-10-15T10:00')).toBe('2025-10-15T10:00:00');
  });
});
