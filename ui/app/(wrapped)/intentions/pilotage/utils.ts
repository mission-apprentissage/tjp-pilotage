import {ScopeEnum} from 'shared';

import type {Filters,FiltersPilotageIntentions } from './types';

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


/**
 * Récupère le code du filtre en fonction du scope :
 * - Si le scope est académie, récupérer le code académie
 * - Si le scope est région, récupérer le code region
 * - Si le scope est département, récupérer le code département
 * - Si le scope est national, ne pas récupérer de code
 */
export const getScopeCode = (filters: FiltersPilotageIntentions) => {
  switch (filters.scope) {
  case ScopeEnum["région"]:
    return filters.codeRegion;
  case ScopeEnum["académie"]:
    return filters.codeAcademie;
  case ScopeEnum["département"]:
    return filters.codeDepartement;
  case ScopeEnum["national"]:
  default:
    return undefined;
  }
};
