const scale = [
  { max: 0.5, bg: "#ffb7a5", color: "inherited" },
  { max: 0.7, bg: "#ffcc9f", color: "inherited" },
  { max: 1.3, bg: "#f2f2ff", color: "inherited" },
  { max: 1.6, bg: "#b1b1f9", color: "inherited" },
  { max: 1000, bg: "#8585f6", color: "white" },
] as const;

export const getTauxPressionStyle = (value: number | undefined) => {
  if (value === undefined) return "";
  const { bg, color } = scale.find((item) => value < item.max) ?? {};
  return { background: bg, color };
};
