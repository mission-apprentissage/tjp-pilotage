export const getMillesimePrecedent = (millesimeSortie: string): string =>
  `${parseInt(millesimeSortie.split("_")[0]) - 1}_${parseInt(millesimeSortie.split("_")[2]) - 1}`;

export const getMillesimeSuivant = (millesimeSortie: string): string =>
  `${parseInt(millesimeSortie.split("_")[0]) + 1}_${parseInt(millesimeSortie.split("_")[2]) + 1}`;

