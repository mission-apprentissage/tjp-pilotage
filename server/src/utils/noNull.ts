type NoNull<T extends object | undefined | null> = T extends null | undefined
  ? undefined
  : {
      [k in keyof T]: T[k] extends Exclude<T[k], null>
        ? T[k]
        : Exclude<T[k], null> | undefined;
    };

export const cleanNull = <T extends object | undefined | null>(
  value: T
): NoNull<T> => {
  if (value === undefined || value === null) {
    return undefined as NoNull<T>;
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, val]) => [
      key,
      val === null ? undefined : val,
    ])
  ) as NoNull<T>;
};
