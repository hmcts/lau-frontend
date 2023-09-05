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
const caseEndTimestampSuffix = document.getElementsByClassName('case-end-timestamp-suffix')[0] as HTMLElement;

const logonStartTimestampSuffix = document.getElementsByClassName('logon-start-timestamp-suffix')[0] as HTMLElement;
const logonEndTimestampSuffix = document.getElementsByClassName('logon-end-timestamp-suffix')[0] as HTMLElement;

const caseDeletionsStartTimestampSuffix = document.getElementsByClassName('case-deletions-start-timestamp-suffix')[0] as HTMLElement;
const caseDeletionsEndTimestampSuffix = document.getElementsByClassName('case-deletions-end-timestamp-suffix')[0] as HTMLElement;

const deletedUsersStartTimestampSuffix = document.getElementsByClassName('deleted-users-start-timestamp-suffix')[0] as HTMLElement;
const deletedUsersEndTimestampSuffix = document.getElementsByClassName('deleted-users-end-timestamp-suffix')[0] as HTMLElement;

const getOptions = (suffixEl: HTMLElement): Options => {
  return {
    allowInvalidPreload: true,
    enableTime: true,
    allowInput: true,
    enableSeconds: true,
    clickOpens: false,
    closeOnSelect: true,
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

// ------------------------ Case Search Datepicker ------------------------
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

// ------------------------ Logon Search Datepicker ------------------------
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

// ------------------------ User Deletions Search Datepicker ------------------------
const userDeletionsForm = getById('user-deletions-search-form') as HTMLFormElement | null;
if (userDeletionsForm && getById('userDeletionsStartTimestamp') && getById('userDeletionsEndTimestamp')) {
  const startCal: flatpickr.Instance = flatpickr('#userDeletionsStartTimestamp', getOptions(deletedUsersStartTimestampSuffix)) as flatpickr.Instance;
  deletedUsersStartTimestampSuffix.addEventListener('click', () => {
    startCal.isOpen ? startCal.close() : startCal.open();
  });

  const endCal: flatpickr.Instance = flatpickr('#userDeletionsEndTimestamp', getOptions(deletedUsersEndTimestampSuffix)) as flatpickr.Instance;
  deletedUsersEndTimestampSuffix.addEventListener('click', () => {
    endCal.isOpen ? endCal.close() : endCal.open();
  });
}

// ------------------------ Case Deletions Search Datepicker ------------------------
const caseDeletionsForm = getById('case-deletions-search-form') as HTMLFormElement | null;
if (caseDeletionsForm && getById('caseDeletionsStartTimestamp') && getById('caseDeletionsEndTimestamp')) {
  const startCal: flatpickr.Instance = flatpickr('#caseDeletionsStartTimestamp', getOptions(caseDeletionsStartTimestampSuffix)) as flatpickr.Instance;
  caseDeletionsStartTimestampSuffix.addEventListener('click', () => {
    startCal.isOpen ? startCal.close() : startCal.open();
  });

  const endCal: flatpickr.Instance = flatpickr('#caseDeletionsEndTimestamp', getOptions(caseDeletionsEndTimestampSuffix)) as flatpickr.Instance;
  caseDeletionsEndTimestampSuffix.addEventListener('click', () => {
    endCal.isOpen ? endCal.close() : endCal.open();
  });
}
