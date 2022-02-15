export const formatQueryString = function (params: Record<string, unknown>): string {
  const qs = Object.keys(params)
    .map(key => key + '=' + params[key])
    .join('&');

  return `/service-endpoint?${qs}`;
};

export const numberWithCommas = function (x: string | number): string {
  const num: string = typeof x === 'number' ? x.toString() : x;
  return num.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};
