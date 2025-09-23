import type { MILLESIMES_IJ } from "shared";
import type { FiltersSchema } from "shared/routes/schemas/get.restitution.demandes.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { getCurrentCampagne } from '@/modules/utils/getCurrentCampagne';

import { getDemandesRestitutionQuery } from "./deps/getDemandesRestitution.dep";
import { getFilters } from "./deps/getFilters.dep";
import { getRentreesPilotage } from "./deps/getRentreesPilotage.dep";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
  campagne: string;
}
export interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

const getDemandesRestitutionFactory =
  (
    deps = {
      getDemandesRestitutionQuery,
      getFilters,
      getCurrentCampagne,
      getRentreesPilotage
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const campagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters?.campagne ?? campagne.annee;
      const [{ count, demandes }, filters, rentreesPilotage] = await Promise.all([
        deps.getDemandesRestitutionQuery({
          ...activeFilters,
          campagne: anneeCampagne,
        }),
        deps.getFilters({ ...activeFilters, campagne: anneeCampagne }),
        deps.getRentreesPilotage()
      ]);

      return {
        count,
        filters,
        demandes,
        campagne,
        rentreesPilotage,
      };
    };

export const getDemandesRestitutionUsecase = getDemandesRestitutionFactory();
