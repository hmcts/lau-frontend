const logger = require('../logger');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

async function clickNavigationLink(I, linkHref) {
  logger.info('Clicking on navigation link: ' + linkHref);
  await I.click(`a[href="${linkHref}"]`);
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
 * Function to get pdf path within chunk directories
 *
 * @returns {null|{fullPath: string, filename: *, codeceptPath: string}}
 */
function getPdfPath() {
  const outputDir = fs.readdirSync(path.resolve(__dirname, '../functional-output'), {withFileTypes: true})
    .filter(item => item.isDirectory())
    .map(dir => dir.name);

  if (outputDir && outputDir.length > 0) {
    for (const dir of outputDir) {
      const chunkDir = fs.readdirSync(path.resolve(__dirname, '../functional-output', dir), {withFileTypes: true})
        .filter(item => item.isDirectory())
        .map(d => d.name);

      if (chunkDir.includes('downloads')) {
        const downloadsPath = path.resolve(__dirname, '../functional-output', dir, 'downloads');
        const downloadEntries = fs.readdirSync(downloadsPath, {withFileTypes: true});
        const pdfFile = downloadEntries
          .filter(item => item.isFile() && item.name.substr(-3) === 'pdf')
          .map(file => file.name);

        if (pdfFile.length > 0) {
          // I.handleDownloads() will clean the downloads dir on every call, so there should only ever be 1 file.
          return {
            codeceptPath: `functional-output/${dir}/downloads`,
            filename: pdfFile[0],
            fullPath: path.resolve(__dirname, '../functional-output', dir, 'downloads', pdfFile[0]),
          };
        }
      }
    }

    logger.info('No PDF file found!');
    return null;
  }
}

function assertPdfHeader(pdfPath) {
  const header = fs.readFileSync(pdfPath, {encoding: 'utf8', flag: 'r'}).slice(0, 4);
  assert.equal(header, '%PDF', 'PDF Header');
}

async function waitForPdfPath(timeoutMs = 10000, intervalMs = 500) {
  const start = Date.now();
  // Poll for a short period to allow download to complete
  while (Date.now() - start < timeoutMs) {
    const pdfPath = getPdfPath();
    if (pdfPath) {
      logger.info(`PDF debug: found pdf at ${pdfPath.fullPath}`);
      return pdfPath;
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  return null;
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
  clickNavigationLink,
  getCsvPath,
  getPdfPath,
  assertCsvLineCount,
  assertPdfHeader,
  waitForPdfPath
};
