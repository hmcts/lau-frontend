import moment from 'moment';

export const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/gm;
export const DATE_REGEX_WITHOUT_SECONDS = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/gm;
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
const SECONDS = ':00';

export const isDateValid = (date: string): boolean => {
  date = addSeconds(date);
  return date?.match(DATE_REGEX) && moment.utc(date, REQUEST_DATE_FORMAT).isValid();
};

export const formDateToRequestDate = (date: string): string => {
  return addSeconds(date);
};

export const requestDateToFormDate = (date: string, msg='N/A'): string => {
  return date ? moment(date, REQUEST_DATE_FORMAT).format(FORM_DATE_FORMAT).toString() : msg;
};

export const formatDate = (date: string): string => date.replace('T', ' ').split('.')[0];


export const csvDate = (): string => {
  return moment().format(CSV_DATE_FORMAT).toString();
};

const addSeconds = (date: string): string =>{
  if(date?.match(DATE_REGEX_WITHOUT_SECONDS)){
    date = date + SECONDS;
  }
  return date;
};

