import type { MILLESIMES_IJ } from "shared";
import type { FiltersSchema } from "shared/routes/schemas/get.restitution-intentions.demandes.schema";
import type { z } from "zod";

import type { RequestUser } from "@/modules/core/model/User";
import { getCurrentCampagneQuery } from "@/modules/data/queries/getCurrentCampagne/getCurrentCampagne.query";
import { getStatsSortieParRegionsEtNiveauDiplomeQuery } from "@/modules/data/queries/getStatsSortie/getStatsSortie";

import { getDemandesRestitutionIntentionsQuery } from "./deps/getDemandesRestitutionIntentions.query";
import { getFilters } from "./deps/getFilters.query";

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
      getFilters: getFilters,
      getCurrentCampagneQuery,
      getStatsSortieParRegionsEtNiveauDiplomeQuery,
    }
  ) =>
  async (activeFilters: ActiveFilters) => {
    const campagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters?.campagne ?? campagne.annee;
    const [{ count, demandes }, filters] = await Promise.all([
      deps.getDemandesRestitutionIntentionsQuery({
        ...activeFilters,
        campagne: anneeCampagne,
      }),
      deps.getFilters({ ...activeFilters, campagne: anneeCampagne }),
    ]);

    return {
      count,
      filters,
      demandes,
      campagne,
    };
  };

export const getDemandesRestitutionIntentionsUsecase = getDemandesRestitutionIntentionsFactory();
