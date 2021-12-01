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

const startTimestampSuffix = document.getElementsByClassName('start-timestamp-suffix')[0] as HTMLElement;
const endTimestampSuffix = document.getElementsByClassName('end-timestamp-suffix')[0] as HTMLElement;

const getOptions = (suffixEl: HTMLElement): Options => {
  return {
    allowInvalidPreload: true,
    enableTime: true,
    allowInput: true,
    enableSeconds: true,
    clickOpens: false,
    closeOnSelect: true,
    ignoredFocusElements: [
      startTimestampSuffix,
      endTimestampSuffix,
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

const form = getById('case-search-form') as HTMLFormElement | null;

if (form && getById('startTimestamp') && getById('endTimestamp')) {
  const startCal: flatpickr.Instance = flatpickr('#startTimestamp', getOptions(startTimestampSuffix)) as flatpickr.Instance;
  startTimestampSuffix.addEventListener('click', () => {
    startCal.isOpen ? startCal.close() : startCal.open();
  });

  const endCal: flatpickr.Instance = flatpickr('#endTimestamp', getOptions(endTimestampSuffix)) as flatpickr.Instance;
  endTimestampSuffix.addEventListener('click', () => {
    endCal.isOpen ? endCal.close() : endCal.open();
  });
}
