const scale = [
  [0.5, "#ffb6b3de"],
  [0.7, "#ffb6b3ba"],
  [0.9, "#ffd5d4"],
  [1.2, "#e7f1e8"],
  [1.4, "#bde7bd9e"],
  [1.8, "#bde7bdc7"],
  [100, "#bde7bd"],
];

export const getBg = (value: number | undefined) => {
  if (value === undefined) return "";
  const color = scale.find((item) => value < item[0])?.[1];
  return color;
};
