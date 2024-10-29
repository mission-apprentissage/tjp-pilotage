type NoNull<T extends unknown | undefined | null> = T extends null | undefined
  ? undefined
  : T extends unknown[]
    ? ClearArray<T>
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends (...args: any) => any
      ? T
      : {
          [k in keyof T]: NoNull<T[k]>;
        };

type ClearArray<T extends unknown[]> = T extends [infer F, ...infer R]
  ? R extends never[]
    ? [NoNull<F>]
    : [NoNull<F>, ...ClearArray<R>]
  : T extends (infer I)[]
    ? NoNull<I>[]
    : T;

export const cleanNull = <T extends object | undefined | null>(value: T): NoNull<T> => {
  if (value === undefined || value === null) {
    return undefined as NoNull<T>;
  }
  if (typeof value !== "object") return value;

  if (Array.isArray(value)) {
    return value.map(cleanNull) as NoNull<T>;
  }

  if (!Object.keys(value).length) return value as NoNull<T>;

  return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, cleanNull(val)])) as NoNull<T>;
};
