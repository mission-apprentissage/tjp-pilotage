export const safeParseInt = (value: string | undefined) => {
  if (value === undefined) return;
  const parsed = parseInt(value);
  if (Number.isNaN(parsed)) return;
  return parsed;
};
