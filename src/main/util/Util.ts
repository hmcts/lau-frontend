export const numberWithCommas = function (x: string | number): string {
  const num: number = typeof x === 'string' ? parseInt(x) : x;
  return isNaN(num) ? '' : num.toLocaleString();
};

export function mapOrElse<T, R>(arr: T[]|null|undefined, mapFn: (t: T) => R, elseValue: R[]): R[] {
  return arr && arr.length ? arr.map(mapFn) : elseValue;
}

export function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
