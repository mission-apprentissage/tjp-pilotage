export const formatTauxTransformation = (transformes: number, effectif: number | undefined) => {
  if (typeof effectif === "undefined" || effectif === 0) {
    return 0;
  }

  return Math.round((transformes / effectif) * 10000) / 100;
};
