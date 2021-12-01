export const formatQueryString = function (params: Record<string, unknown>): string {
  const qs = Object.keys(params)
    .map(key => key + '=' + params[key])
    .join('&');

  return `/service-endpoint?${qs}`;
};
