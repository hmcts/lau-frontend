import flatpickr from 'flatpickr';
import {Options} from 'flatpickr/dist/types/options';
import {getById} from './selectors';

const zeroPad = (n: number): string => {
  return n.toString().padStart(2, '0');
};

const formatDate = (date: Date): string => {
  return `${date.getFullYear()}-${zeroPad(date.getMonth() + 1)}-${zeroPad(date.getDate())}`
    + ` ${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}:${zeroPad(date.getSeconds())}`;
};

const caseStartTimestampSuffix = document.getElementsByClassName('case-start-timestamp-suffix')[0] as HTMLElement;
const logonStartTimestampSuffix = document.getElementsByClassName('logon-start-timestamp-suffix')[0] as HTMLElement;
const caseEndTimestampSuffix = document.getElementsByClassName('case-end-timestamp-suffix')[0] as HTMLElement;
const logonEndTimestampSuffix = document.getElementsByClassName('logon-end-timestamp-suffix')[0] as HTMLElement;

const getOptions = (suffixEl: HTMLElement): Options => {
  return {
    allowInvalidPreload: true,
    enableTime: true,
    allowInput: true,
    enableSeconds: true,
    clickOpens: false,
    closeOnSelect: true,
    ignoredFocusElements: [
      caseStartTimestampSuffix,
      logonStartTimestampSuffix,
      caseEndTimestampSuffix,
      logonEndTimestampSuffix,
    ],
    formatDate: (date: Date) => {
      return formatDate(date);
    },
    onOpen: () => {
      suffixEl.classList.add('flatpickr-open');
    },
    onClose: () => {
      suffixEl.classList.remove('flatpickr-open');
    },
  };
};

const caseForm = getById('case-search-form') as HTMLFormElement | null;
if (caseForm && getById('caseStartTimestamp') && getById('caseEndTimestamp')) {
  const startCal: flatpickr.Instance = flatpickr('#caseStartTimestamp', getOptions(caseStartTimestampSuffix)) as flatpickr.Instance;
  caseStartTimestampSuffix.addEventListener('click', () => {
    startCal.isOpen ? startCal.close() : startCal.open();
  });

  const endCal: flatpickr.Instance = flatpickr('#caseEndTimestamp', getOptions(caseEndTimestampSuffix)) as flatpickr.Instance;
  caseEndTimestampSuffix.addEventListener('click', () => {
    endCal.isOpen ? endCal.close() : endCal.open();
  });
}

const logonForm = getById('logon-search-form') as HTMLFormElement | null;
if (logonForm && getById('logonStartTimestamp') && getById('logonEndTimestamp')) {
  const startCal: flatpickr.Instance = flatpickr('#logonStartTimestamp', getOptions(logonStartTimestampSuffix)) as flatpickr.Instance;
  logonStartTimestampSuffix.addEventListener('click', () => {
    startCal.isOpen ? startCal.close() : startCal.open();
  });

  const endCal: flatpickr.Instance = flatpickr('#logonEndTimestamp', getOptions(logonEndTimestampSuffix)) as flatpickr.Instance;
  logonEndTimestampSuffix.addEventListener('click', () => {
    endCal.isOpen ? endCal.close() : endCal.open();
  });
}
