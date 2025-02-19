/* eslint-disable-next-line import/default */
import qs from "qs";

export const createParameterizedUrl = (pathname: string, searchParams: object) => {
  return (
    pathname +
    qs.stringify(searchParams, {
      encode: false,
      addQueryPrefix: true,
      filter: (_, value) => value || undefined,
    })
  );
};
