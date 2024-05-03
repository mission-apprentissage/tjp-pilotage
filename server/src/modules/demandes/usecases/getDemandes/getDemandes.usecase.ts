import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import {
  Filters,
  getCampagneQuery,
  getDemandesQuery,
} from "./getDemandes.query";

const getDemandesFactory =
  (
    deps = {
      getDemandesQuery,
      getCurrentCampagneQuery,
      getCampagneQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const currentCampagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne =
      activeFilters.campagne ?? currentCampagne.annee ?? CURRENT_ANNEE_CAMPAGNE;

    const [demandes, campagne] = await Promise.all([
      await deps.getDemandesQuery(activeFilters, anneeCampagne),
      await deps.getCampagneQuery(anneeCampagne),
    ]);

    return { ...demandes, currentCampagne, campagne };
  };

export const getDemandesUsecase = getDemandesFactory();
