const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const fs = require('fs');
const path = require('path');
const assert = require('assert');

async function selectTab(I, tab) {
  logger.info('Selecting tab: ' + tab);
  await I.waitForElement(`#${tab}`, 10);
  await I.click(`#${tab}`);
}

/**
 * Function to get csv path within chunk directories
 *
 * @returns {null|{fullPath: string, filename: *, codeceptPath: string}}
 */
function getCsvPath() {
  const outputDir = fs.readdirSync(path.resolve(__dirname, '../functional-output'), {withFileTypes: true})
    .filter(item => item.isDirectory())
    .map(dir => dir.name);

  if (outputDir && outputDir.length > 0) {
    for (const dir of outputDir) {
      const chunkDir = fs.readdirSync(path.resolve(__dirname, '../functional-output', dir), {withFileTypes: true})
        .filter(item => item.isDirectory())
        .map(d => d.name);

      if (chunkDir.includes('downloads')) {
        const csvFile = fs.readdirSync(path.resolve(__dirname, '../functional-output', dir, 'downloads'), {withFileTypes: true})
          .filter(item => item.isFile() && item.name.substr(-3) === 'csv')
          .map(file => file.name);

        if (csvFile.length > 0) {
          // I.handleDownloads() will clean the downloads dir on every call, so there should only ever be 1 file.
          return {
            codeceptPath: `functional-output/${dir}/downloads`,
            filename: csvFile[0],
            fullPath: path.resolve(__dirname, '../functional-output', dir, 'downloads', csvFile[0]),
          };
        }
      }
    }

    logger.info('No CSV file found!');
    return null;
  }
}

/**
 * NOTE: The CSV files do not end in a new line. So a file with 10,001 lines which includes the header and data,
 * will return as 10,000.
 *
 * @param csvPath
 * @param lines
 */
function assertCsvLineCount(csvPath, lines) {
  let i;
  let count = 0;
  require('fs').createReadStream(csvPath)
    .on('data', function(chunk) {
      for (i=0; i < chunk.length; ++i)
        if (chunk[i] === 10) count++;
    })
    .on('end', function() {
      assert.equal(count, lines, 'CSV Lines');
    });
}

module.exports = {
  selectTab,
  getCsvPath,
  assertCsvLineCount,
};
