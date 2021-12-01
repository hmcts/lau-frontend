import { getById } from './selectors';

const loadingOverlay = document.getElementsByClassName('loading-overlay')[0] as HTMLDivElement;

const forms = [
  {
    id: 'case-search-form',
    searchButtonName: 'case-search-btn',
    csvButtons: [
      {id: 'activityCsvBtn', uri: '/case-activity/csv'},
      {id: 'searchesCsvBtn', uri: '/case-searches/csv'},
    ],
  },
  {
    id: 'logon-search-form',
    searchButtonName: 'logon-search-btn',
    csvButtons: [
      {id: 'logonsCsvBtn', uri: '/logons/csv'},
    ],
  },
];

for (const form of forms) {
  const formEl = getById(form.id) as HTMLFormElement | null;
  if (formEl) {
    // On search button click, disable button and fields until search is complete.
    // On search completion, the page will reload and re-enable the button and fields.
    const searchButton: HTMLButtonElement | null = document.getElementsByName(form.searchButtonName)[0] as HTMLButtonElement;
    if (searchButton) {
      searchButton.onclick = function() {
        searchButton.textContent = 'Searching...';
        searchButton.disabled = true;

        formEl.submit();

        loadingOverlay.style.display = 'flex';
      };
    }

    const csvOnClick = function(btn: HTMLButtonElement, uri: string) {
      return function() {
        btn.disabled = true;

        const innerHtml = btn.innerHTML;
        btn.innerHTML = '<div class="spinner"></div> Generating CSV ...';

        fetch(uri)
          .then(res => res.json())
          .then(json => {
            // Need to create link element to set the filename
            const link = document.createElement('a');
            link.download = json.filename;
            link.href = 'data:text/csv;charset=utf-8,' + json.csv;
            link.click();
            link.remove();

            // Add a 1s timeout to account for the download dialog to display
            setTimeout(() => {
              btn.innerHTML = innerHtml;
              btn.disabled = false;
            }, 1000);
          });
      };
    };

    for (const csvBtn of form.csvButtons) {
      // On download CSV button press, disable button and add loading spinner
      const csvBtnEl: HTMLButtonElement | null = getById(csvBtn.id) as HTMLButtonElement;
      if (csvBtnEl) {
        csvBtnEl.onclick = csvOnClick(csvBtnEl, csvBtn.uri);
      }
    }
  }
}

// On pagination load, display grey overlay with loading spinner
const paginationLinks = document.getElementsByClassName('pagination-link') as HTMLCollectionOf<HTMLAnchorElement>;
if (paginationLinks && paginationLinks.length > 0) {
  for (const link of Array.from(paginationLinks)) {
    link.onclick = function () {
      // Set display to flex, this will revert back to none after page loads
      loadingOverlay.style.display = 'flex';
    };
  }
}
