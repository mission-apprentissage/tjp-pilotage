const scale = [
  { max: 0.5, bg: "#ffb7a5", color: "white" },
  { max: 0.7, bg: "#ffcc9f", color: "inherited" },
  { max: 1.3, bg: "#f2f2ff", color: "inherited" },
  { max: 1.6, bg: "#b1b1f9", color: "white" },
  { max: 1000, bg: "#8585f6", color: "white" },
] as const;

const scaleBTS = [
  { max: 5, bg: "#ffb7a5", color: "white" },
  { max: 10, bg: "#ffcc9f", color: "inherited" },
  { max: 15, bg: "#f2f2ff", color: "inherited" },
  { max: 20, bg: "#b1b1f9", color: "white" },
  { max: 1000, bg: "#8585f6", color: "white" },
] as const;

export const getTauxPressionStyle = (value: number | undefined) => {
  if (value === undefined) return {};
  const { bg, color } = scale.find((item) => value < item.max) ?? {};
  return { background: bg, color };
};

export const getTauxDemandeStyle = (value: number | undefined) => {
  if (value === undefined) return {};
  const { bg, color } = scaleBTS.find((item) => value < item.max) ?? {};
  return { background: bg, color };
};
