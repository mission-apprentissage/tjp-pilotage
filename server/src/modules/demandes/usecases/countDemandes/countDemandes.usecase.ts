import { getCurrentCampagneQuery } from "@/modules/demandes/queries/getCurrentCampagne/getCurrentCampagne.query";

import type { Filters } from "./countDemandes.query";
import { countDemandesQuery } from "./countDemandes.query";
const countDemandesFactory =
  (
    deps = {
      countDemandesQuery,
      getCurrentCampagneQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const currentCampagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters.anneeCampagne ?? currentCampagne.annee;

    return await deps.countDemandesQuery({
      anneeCampagne,
      ...activeFilters,
    });
  };

export const countDemandesUsecase = countDemandesFactory();
