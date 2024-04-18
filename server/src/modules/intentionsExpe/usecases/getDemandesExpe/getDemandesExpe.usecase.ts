import { CURRENT_ANNEE_CAMPAGNE } from "shared/time/CURRENT_ANNEE_CAMPAGNE";

import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import {
  Filters,
  getCampagneQuery,
  getDemandesExpeQuery,
} from "./getDemandesExpe.query";

const getDemandesExpeFactory =
  (
    deps = {
      getDemandesExpeQuery,
      getCurrentCampagneQuery,
      getCampagneQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const currentCampagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne =
      activeFilters.campagne ?? currentCampagne.annee ?? CURRENT_ANNEE_CAMPAGNE;

    const [demandes, campagne] = await Promise.all([
      await deps.getDemandesExpeQuery(activeFilters, anneeCampagne),
      await deps.getCampagneQuery(anneeCampagne),
    ]);

    return { ...demandes, currentCampagne, campagne };
  };

export const getDemandesExpeUsecase = getDemandesExpeFactory();
