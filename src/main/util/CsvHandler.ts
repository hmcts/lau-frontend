import {AsyncParser, FieldInfo} from 'json2csv';
import {Logs as LogsModel} from '../models/Logs';
import {LoggerInstance} from 'winston';
import { performance } from'perf_hooks';

const {Logger} = require('@hmcts/nodejs-logging');
const logger: LoggerInstance = Logger.getLogger('CsvHandler');

/**
 * Function to convert the string array of fields to the FieldInfo object for json2csv.
 * This will add a label which will convert the field names from camelCase to Normal Case.
 *
 * @param fields Field names from the JSON object
 */
function parseFields(fields: string[]): FieldInfo<string>[] {
  return fields.map(field => {
    const addSpaces = field.replace(/([A-Z])/g, ' $1');
    const capitalize = addSpaces === 'timestamp' ? 'Timestamp (UTC)' : addSpaces.charAt(0).toUpperCase() + addSpaces.slice(1);

    return {
      label: capitalize,
      value: field,
    };
  });
}

/**
 * Function to parse the log data into a csv string.
 *
 * @param Logs Log class
 */
function jsonToCsv(Logs: LogsModel<unknown>): Promise<string> {
  const opts = { fields: parseFields(Logs.fields) };
  const transformOpts = { objectMode: true };

  const asyncParser = new AsyncParser(opts, transformOpts);

  let csv = '';

  // This may need to be changed to an observable (RXJS).
  return new Promise((resolve, reject) => {
    logger.info('Processing CSV...');
    const startTime = performance.now();
    asyncParser.processor
      .on('data', chunk => (csv += chunk.toString()))
      .on('end', () => resolve(csv))
      .on('error', err => reject(err));
    Logs.csvData.forEach(d => asyncParser.input.push(d));
    asyncParser.input.end();
    const processTime = performance.now() - startTime;
    logger.info('CSV process time: ' + processTime + ' milliseconds');
  });
}

export {jsonToCsv};
