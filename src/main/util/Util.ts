export const formatQueryString = function (params: Record<string, unknown>): string {
  const qs = Object.keys(params)
    .map(key => key + '=' + params[key])
    .join('&');

  return `/service-endpoint?${qs}`;
};

export const numberWithCommas = function (x: string | number): string {
  const num: number = typeof x === 'string' ? parseInt(x) : x;
  return isNaN(num) ? '' : num.toLocaleString();
};
