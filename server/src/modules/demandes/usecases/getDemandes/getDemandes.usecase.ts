import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { getCurrentCampagneQuery } from "@/modules/demandes/queries/getCurrentCampagne/getCurrentCampagne.query";

import type { Filters } from "./deps";
import { getCampagne, getDemandes, getFilters } from "./deps";

const getDemandesFactory =
  (
    deps = {
      getDemandes,
      getCurrentCampagneQuery,
      getCampagne,
      getFilters,
    }
  ) =>
  async (activeFilters: Filters) => {
    const currentCampagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee ?? CURRENT_ANNEE_CAMPAGNE;

    const [demandes, campagne, filters] = await Promise.all([
      deps.getDemandes({ ...activeFilters, campagne: anneeCampagne }),
      deps.getCampagne(anneeCampagne),
      deps.getFilters(activeFilters),
    ]);

    return { ...demandes, currentCampagne, campagne, filters };
  };

export const getDemandesUsecase = getDemandesFactory();
