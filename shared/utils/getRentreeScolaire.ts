export const getRentreeScolairePrecedente = (rentreeScolaire: string): string => `${parseInt(rentreeScolaire) - 1}`;

export const getRentreeScolaireSuivante = (rentreeScolaire: string): string => `${parseInt(rentreeScolaire) + 1}`;

export const getRentreeScolaire = ({ rentreeScolaire, offset }: { rentreeScolaire: string; offset: number }): string =>
  `${+rentreeScolaire + offset}`;

export const getDateRentreeScolaire = (rentreeScolaire: string): string => `${rentreeScolaire}-09-01`;
