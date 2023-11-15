export const getRentreeScolairePrecedente = (rentreeScolaire: string): string =>
  `${parseInt(rentreeScolaire) - 1}`;

export const getRentreeScolaireSuivante = (rentreeScolaire: string): string =>
  `${parseInt(rentreeScolaire) + 1}`;
