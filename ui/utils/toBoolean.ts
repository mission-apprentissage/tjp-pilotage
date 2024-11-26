export const toBoolean = <V extends string | undefined, R = V extends undefined ? boolean | undefined : boolean>(
  value: V
): R => {
  if (typeof value === "undefined") return undefined as R;
  return (value === "true") as R;
};
