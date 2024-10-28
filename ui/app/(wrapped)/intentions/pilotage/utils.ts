import type { StatsPilotageIntentions } from "./types";

export const findDefaultRentreeScolaireForCampagne = (
  annee: string,
  rentreesScolaires: StatsPilotageIntentions["filters"]["rentreesScolaires"]
) => {
  if (rentreesScolaires) {
    // @ts-expect-error TODO
    const rentreeScolaire = rentreesScolaires.find((r) => parseInt(r.value) === parseInt(annee) + 1);

    if (rentreeScolaire) return rentreeScolaire.value;
  }

  return undefined;
};
