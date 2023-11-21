export const getMillesimeFromRentreeScolaire = ({
  rentreeScolaire,
  offset,
}: {
  rentreeScolaire: string;
  offset: number;
}): string =>
  `${+rentreeScolaire + (offset - 2)}_${+rentreeScolaire + (offset - 1)}`;

export const getRentreeScolaire = ({
  rentreeScolaire,
  offset,
}: {
  rentreeScolaire: string;
  offset: number;
}): string => `${+rentreeScolaire - offset}`;
