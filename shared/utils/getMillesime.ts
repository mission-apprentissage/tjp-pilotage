export const getMillesimePrecedent = (millesimeSortie: string): string =>
  `${parseInt(millesimeSortie.split("_")[0]) - 1}_${parseInt(millesimeSortie.split("_")[1]) - 1}`;

export const getMillesimeSuivant = (millesimeSortie: string): string =>
  `${parseInt(millesimeSortie.split("_")[0]) + 1}_${parseInt(millesimeSortie.split("_")[1]) + 1}`;

export const getMillesime = ({ millesimeSortie, offset }: { millesimeSortie: string; offset: number }): string =>
  `${parseInt(millesimeSortie.split("_")[0]) + offset}_${parseInt(millesimeSortie.split("_")[1]) + offset}`;

export const getMillesimeFromRentreeScolaire = ({
  rentreeScolaire,
  offset,
}: {
  rentreeScolaire: string;
  offset: number;
}): string => `${+rentreeScolaire + (offset - 2)}_${+rentreeScolaire + (offset - 1)}`;
