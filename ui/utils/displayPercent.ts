export const displayPercentage = (value?: number, numberOfDigits: number = 2) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: numberOfDigits,
    maximumFractionDigits: numberOfDigits,
  }).format(value ?? 0);
};
