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
const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('Date');

export const isDateValid = (date: string): boolean => {
  date = addSeconds(date);
  logger.info("timezone :" + Intl.DateTimeFormat().resolvedOptions().timeZone);
  var currentDate = moment().utc().format(REQUEST_DATE_FORMAT);
  return date?.match(DATE_REGEX) && moment.utc(date, REQUEST_DATE_FORMAT).isValid() && moment.utc(date, REQUEST_DATE_FORMAT).isSameOrBefore(currentDate);
};

export const formDateToRequestDate = (date: string): string => {
  return addSeconds(date);
};

export const requestDateToFormDate = (date: string): string => {
  return moment(date, REQUEST_DATE_FORMAT).format(FORM_DATE_FORMAT).toString();
};

export const csvDate = (): string => {
  return moment().format(CSV_DATE_FORMAT).toString();
};

const addSeconds = (date: string): string =>{
  if(date?.match(DATE_REGEX_WITHOUT_SECONDS)){
    date = date + SECONDS;
  }
  return date;
};
