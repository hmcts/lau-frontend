import accessibleAutocomplete from 'accessible-autocomplete';
import {qs, qsa} from './selectors';

const elements = qsa('select.accessible-autocomplete');

elements.forEach((element) => {
  accessibleAutocomplete.enhanceSelectElement({
    defaultValue: '',
    id: element.id,
    selectElement: element,
    confirmOnBlur: false,
    inputClasses: 'govuk-input govuk-!-width-three-quarters',
    hintClasses: 'govuk-!-width-three-quarters',
    menuClasses: 'govuk-!-width-three-quarters',
    menuAttributes: {
      'aria-labelledby': element.id,
    },
    displayMenu: 'inline',
    minLength: 2,
    showAllValues: false,
  });

  setTimeout(() => {
    const newEl = qs(element.id);
    newEl.setAttribute('aria-labelledby', element.id);
  }, 10);
});
