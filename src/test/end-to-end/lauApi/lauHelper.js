import logger from '../logger.js';
import fs, {createReadStream} from 'node:fs';
import assert from 'node:assert';

async function clickNavigationLink(I, linkHref) {
  const locator = `a[href="${linkHref}"]`;
  const timeout = 30; // Add a tiny timeout
  await I.waitForInvisible('.loading-overlay', timeout);
  await I.waitForVisible(locator, timeout);

  logger.info('Clicking on navigation link: ' + linkHref);
  await I.click(locator);
  await I.waitInUrl(linkHref, timeout);
  await I.waitForInvisible('.loading-overlay', timeout);
}

function assertPdfHeader(pdfPath) {
  const header = fs.readFileSync(pdfPath, {encoding: 'utf8', flag: 'r'}).slice(0, 4);
  assert.equal(header, '%PDF', 'PDF Header');
}

/**
 * NOTE: The CSV files do not end in a new line. So a file with 10,001 lines which includes the header and data,
 * will return as 10,000.
 *
 * @param csvPath
 * @param lines
 */
function assertCsvLineCount(csvPath, lines) {
  return new Promise((resolve, reject) => {
    let count = 0;
    createReadStream(csvPath)
      .on('data', chunk => {
        for (let i = 0; i < chunk.length; ++i)
          if (chunk[i] === 10) {
            count++;
          }
      })
      .on('end', () => {
        try {
          assert.equal(count, lines, 'CSV Lines');
          resolve();
        } catch (error) {
          reject(error);
        }

      })
      .on('error', error => reject(error));
  });
}

export default {
  clickNavigationLink,
  assertCsvLineCount,
  assertPdfHeader,
};
