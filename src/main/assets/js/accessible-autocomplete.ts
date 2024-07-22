import accessibleAutocomplete from 'accessible-autocomplete';
import {qsa} from './selectors';
const elements = qsa('select.accessible-autocomplete');

elements.forEach((element) => {

  accessibleAutocomplete.enhanceSelectElement({
    defaultValue: '',
    id: element.id,
    selectElement: element,
    confirmOnBlur: true,
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
    element.setAttribute('aria-label', element.id);
  }, 10);
});

const typeaheadInputs = qsa('input.autocomplete__input');

typeaheadInputs.forEach((element: HTMLInputElement) => {
  element.addEventListener('blur', () => {
    const inputField = document.getElementById(element.id) as HTMLInputElement;
    const selectField = document.getElementById(element.id + '-select') as HTMLSelectElement;

    if (inputField.value.trim() === '') {
      selectField.value = '';
    }
  });
});
