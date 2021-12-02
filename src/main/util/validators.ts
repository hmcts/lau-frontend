import moment, {Moment} from 'moment';
import {isDateValid, partialDateRegex} from './Date';

export const atLeastOneFieldIsFilled = (fields: { [s: string]: unknown; }): string => {
  if (!fields || (Object.keys(fields).length === 0) || !Object.values(fields).some(field => field !== '')) {
    return 'required';
  }
};

export const isFilledIn = (field: string): string => {
  if (!field || field === '') {
    return 'required';
  }
};

// Date should be of the format: 2020-18-03 12:03:04
export const validDateInput = (date: string): string => {
  if (date && !isDateValid(date)) {
    return 'invalid';
  }
};

export const startDateBeforeEndDate = (fields: { [s: string]: unknown; }): string => {
  if (fields.startTimestamp && fields.endTimestamp) {
    const startDate: Moment = moment.utc(fields.startTimestamp, 'yyyy-MM-dd HH:mm:ss');
    const endDate: Moment = moment.utc(fields.endTimestamp, 'yyyy-MM-dd HH:mm:ss');

    if ((startDate.isValid() && endDate.isValid()) && startDate.isAfter(endDate) || fields.startTimestamp === fields.endTimestamp) {
      return 'startDateBeforeEndDate';
    }
  }
};

export const fillPartialTimestamp = (date: string): string => {
  switch (true) {
    case partialDateRegex.Y.test(date):
      date += '-01-01 00:00:00';
      break;
    case partialDateRegex.YM.test(date):
      date += '-01 00:00:00';
      break;
    case partialDateRegex.YMD.test(date):
      date += ' 00:00:00';
      break;
    case partialDateRegex.YMDH.test(date):
      date += ':00:00';
      break;
    case partialDateRegex.YMDHM.test(date):
      date += ':00';
      break;
    default:
      break;
  }

  return date;
};
