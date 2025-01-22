
import { getCurrentCampagne } from "@/modules/utils/getCurrentCampagne";

import type { Filters } from "./countDemandes.query";
import { countDemandesQuery } from "./countDemandes.query";
const countDemandesFactory =
  (
    deps = {
      countDemandesQuery,
      getCurrentCampagne,
    }
  ) =>
    async (activeFilters: Filters) => {
      const currentCampagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee;

      return await deps.countDemandesQuery({
        campagne: anneeCampagne,
        ...activeFilters,
      });
    };

export const countDemandesUsecase = countDemandesFactory();
