import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { Filters, getDemandesQuery } from "./getDemandes.query";

const getDemandesFactory =
  (
    deps = {
      getDemandesQuery,
      getCurrentCampagneQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const campagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne =
      activeFilters.campagne ?? campagne.annee ?? CURRENT_ANNEE_CAMPAGNE;

    const demandes = await deps.getDemandesQuery(activeFilters, anneeCampagne);

    return { ...demandes, campagne };
  };

export const getDemandesUsecase = getDemandesFactory();
