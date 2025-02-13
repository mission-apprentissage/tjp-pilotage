import type { Filters } from "./types";

export const findDefaultRentreeScolaireForCampagne = (
  annee: string,
  rentreesScolaires: Filters["rentreesScolaires"]
) => {
  if (rentreesScolaires) {
    const rentreeScolaire = rentreesScolaires.find((r) => parseInt(r.value) === parseInt(annee) + 1);

    if (rentreeScolaire) return rentreeScolaire.value;
  }

  return undefined;
};
