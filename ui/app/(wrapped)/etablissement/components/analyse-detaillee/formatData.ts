export const formatTaux = (value?: number): number =>
  Number(((value ?? 0) * 100).toFixed(0));

export const formatAbsolute = (value?: number): number =>
  Number((value ?? 0).toFixed(2));

export const formatMillesime = (millesime: string): string =>
  `${millesime.split("_")[0]}+${millesime.split("_")[1].substring(2)}`;
