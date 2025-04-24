import { stringify } from "qs";

export const createParameterizedUrl = (pathname: string, searchParams: object) => {
  return (
    pathname +
    stringify(searchParams, {
      encode: false,
      addQueryPrefix: true,
      filter: (_, value) => value ?? undefined,
    })
  );
};
