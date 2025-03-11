import type { MILLESIMES_IJ } from "shared";
import type { FiltersSchema } from "shared/routes/schemas/get.restitution-intentions.demandes.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { getStatsSortieParRegionsEtNiveauDiplomeQuery } from "@/modules/data/queries/getStatsSortie/getStatsSortie";
import { getCurrentCampagne } from '@/modules/utils/getCurrentCampagne';

import { getDemandesRestitutionIntentionsQuery } from "./dependencies/getDemandesRestitutionIntentions.dep";
import { getFilters } from "./dependencies/getFilters.dep";
import { getRentreesPilotage } from "./dependencies/getRentreesPilotage.dep";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
  campagne: string;
}
export interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

const getDemandesRestitutionIntentionsFactory =
  (
    deps = {
      getDemandesRestitutionIntentionsQuery,
      getFilters,
      getCurrentCampagne,
      getStatsSortieParRegionsEtNiveauDiplomeQuery,
      getRentreesPilotage
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const campagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters?.campagne ?? campagne.annee;
      const [{ count, demandes }, filters, rentreesPilotage] = await Promise.all([
        deps.getDemandesRestitutionIntentionsQuery({
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

export const getDemandesRestitutionIntentionsUsecase = getDemandesRestitutionIntentionsFactory();
