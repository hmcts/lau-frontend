export const numberWithCommas = function (x: string | number): string {
  const num: number = typeof x === 'string' ? parseInt(x) : x;
  return isNaN(num) ? '' : num.toLocaleString();
};
