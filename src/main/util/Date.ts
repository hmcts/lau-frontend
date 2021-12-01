import moment from 'moment';

export const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/gm;
export const partialDateRegex = {
  Y: /^(\d{4})$/gm,
  YM: /^(\d{4})-(\d{2})$/gm,
  YMD: /^(\d{4})-(\d{2})-(\d{2})$/gm,
  YMDH: /^(\d{4})-(\d{2})-(\d{2}) (\d{2})$/gm,
  YMDHM: /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/gm,
};
export const FORM_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const REQUEST_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const CSV_DATE_FORMAT = 'YYYY-MM-DD';

export const isDateValid = (date: string): boolean => {
  return date && (date.match(DATE_REGEX) && moment.utc(date, FORM_DATE_FORMAT).isValid());
};

export const formDateToRequestDate = (date: string): string => {
  return moment(date, FORM_DATE_FORMAT).format(REQUEST_DATE_FORMAT).toString();
};

export const requestDateToFormDate = (date: string): string => {
  return moment(date, REQUEST_DATE_FORMAT).format(FORM_DATE_FORMAT).toString();
};

export const csvDate = (): string => {
  return moment().format(CSV_DATE_FORMAT).toString();
};
