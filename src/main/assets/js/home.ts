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

        const startFetchTime = performance.now();
        fetch(uri)
          .then(res => res.json())
          .then(json => {
            const fetchTime = performance.now() - startFetchTime;
            console.log('CSV Data Fetch Time: ' + fetchTime + ' milliseconds');
            console.log('Processing CSV...');

            const startProcessTime = performance.now();

            const {fields, data} = json.csvJson;
            const header = fields.map((field: {label: string, value: string}) => field.label);
            const replacer = (key: string, value: string | []) => {
              if (value === null) {
                return '';
              } else if (Array.isArray(value)) {
                // Need to add space so Excel doesn't do some funky formatting
                return `[${value.toString().replace(',', ', ')}]`;
              } else {
                return value;
              }
            };
            let csv = [
              header.join(','), // header row first
              // @ts-ignore
              ...data.map((row: Record<string, unknown>[]) => fields.map(field => JSON.stringify(row[field.value], replacer)).join(',')),
            ].join('\r\n');
            // Ensure new line characters are encoded so Firefox behaves
            csv = encodeURI(csv);

            // Need to create link element to set the filename
            const link = document.createElement('a');
            link.download = json.filename;
            link.href = 'data:text/csv;charset=utf-8,' + csv;

            // Measure CSV performance
            const processTime = performance.now() - startProcessTime;
            console.log('CSV process time: ' + processTime + ' milliseconds');

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

window.onload = function() {
  loadingOverlay.style.display = 'none';
};
