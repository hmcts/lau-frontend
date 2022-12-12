import {requestDateToFormDate} from '../util/Date';

export abstract class Logs<LogType> {
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
        // @ts-ignore
        d.timestamp = requestDateToFormDate(d.timestamp);
        return d;
      } else {
        return d;
      }
    });
  }
}
