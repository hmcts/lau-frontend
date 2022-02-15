import {Logs as LogsModel} from '../models/Logs';

interface CsvJson {
  fields: {label: string, value: string}[];
  data: unknown[];
}

/**
 * Function to convert the string array of fields to the FieldInfo object for json2csv.
 * This will add a label which will convert the field names from camelCase to Normal Case.
 *
 * @param fields Field names from the JSON object
 */
function parseFields(fields: string[]): {label: string, value: string}[] {
  return fields.map(field => {
    const addSpaces = field.replace(/([A-Z])/g, ' $1');
    const capitalize = addSpaces === 'timestamp' ? 'Timestamp (UTC)' : addSpaces.charAt(0).toUpperCase() + addSpaces.slice(1);

    return {
      label: capitalize,
      value: field,
    };
  });
}

function csvJson(Logs: LogsModel<unknown>): CsvJson {
  return { fields: parseFields(Logs.fields), data: Logs.csvData };
}


export { csvJson };
