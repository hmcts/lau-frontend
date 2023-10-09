import {requestDateToFormDate} from '../util/Date';


interface GenericLogType {
  timestamp?: string;
  deletionTimestamp?: string;
}

export abstract class Logs<LogType extends GenericLogType> {
  public _fields: string[];

  private readonly _data: LogType[];

  constructor(data: LogType[]) {
    this._data = data;
  }

  get fields(): string[] {
    return this._fields;
  }

  get data(): LogType[] {
    return this._data;
  }

  get csvData(): LogType[] {
    return this._data.map(d => {
      if ('timestamp' in d) {
        d.timestamp = requestDateToFormDate(d.timestamp);
        return d;
      } else if ('deletionTimestamp' in d) {
        d.deletionTimestamp = requestDateToFormDate(d.deletionTimestamp);
        return d;
      } else {
        return d;
      }
    });
  }
}
