type NoNull<T extends object> = {
  [k in keyof T]: T[k] extends Exclude<T[k], null>
    ? T[k]
    : Exclude<T[k], null> | undefined;
};

export const cleanNull = <T extends object>(value: T): NoNull<T> => {
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [
      key,
      val === null ? undefined : val,
    ])
  ) as NoNull<T>;
};
