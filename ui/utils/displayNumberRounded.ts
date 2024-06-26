export const displayNumberRounded = (
  value?: number,
  numberOfDigits: number = 2
) => {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: numberOfDigits,
    maximumFractionDigits: numberOfDigits,
  }).format(value ?? 0);
};
