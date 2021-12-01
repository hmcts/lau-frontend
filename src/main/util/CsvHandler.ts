import {AsyncParser, FieldInfo} from 'json2csv';
import {Logs as LogsModel} from '../models/Logs';

/**
 * Function to convert the string array of fields to the FieldInfo object for json2csv.
 * This will add a label which will convert the field names from camelCase to Normal Case.
 *
 * @param fields Field names from the JSON object
 */
function parseFields(fields: string[]): FieldInfo<string>[] {
  return fields.map(field => {
    const addSpaces = field.replace(/([A-Z])/g, ' $1');
    const capitalize = addSpaces.charAt(0).toUpperCase() + addSpaces.slice(1);

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
    asyncParser.processor
      .on('data', chunk => (csv += chunk.toString()))
      .on('end', () => resolve(csv))
      .on('error', err => reject(err));
    Logs.csvData.forEach(d => asyncParser.input.push(d));
    asyncParser.input.end();
  });
}

export {jsonToCsv};
