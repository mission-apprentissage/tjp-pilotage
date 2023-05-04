export const getBg = (
  value: number | undefined,
  [min, max]: [number, number],
  color = "255,174,174"
) => {
  if (value === undefined) return "";
  const opacity = Math.min(Math.max(value / (max - min), 0.12), 1);
  return `rgba(${color},${opacity})`;
};
