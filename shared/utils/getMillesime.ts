export const getMillesimePrecedent = (millesimeSortie: string): string =>
  `${parseInt(millesimeSortie.split("_")[0]) - 1}_${parseInt(millesimeSortie.split("_")[1]) - 1}`;

export const getMillesimeSuivant = (millesimeSortie: string): string =>
  `${parseInt(millesimeSortie.split("_")[0]) + 1}_${parseInt(millesimeSortie.split("_")[1]) + 1}`;

export const getMillesime = ({ millesimeSortie, offset }: { millesimeSortie: string; offset: number }): string =>
  `${parseInt(millesimeSortie.split("_")[0]) + offset}_${parseInt(millesimeSortie.split("_")[1]) + offset}`;

export const getMillesimeFromRentreeScolaire = ({
  rentreeScolaire,
  offset = 0,
}: {
  rentreeScolaire: string;
  offset?: number;
}): string => `${+rentreeScolaire + (offset - 2)}_${+rentreeScolaire + (offset - 1)}`;

export const getMillesimesFromRentreeScolaire = ({
  rentreeScolaire,
  offset = 0,
}: {
  rentreeScolaire: Array<string>;
  offset?: number;
}): Array<string> =>
  rentreeScolaire.map((rentree) => getMillesimeFromRentreeScolaire({ rentreeScolaire: rentree, offset }));
