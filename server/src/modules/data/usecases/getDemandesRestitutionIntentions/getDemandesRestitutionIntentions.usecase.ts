import { getCurrentCampagneQuery } from "@/modules/data/queries/getCurrentCampagne/getCurrentCampagne.query";
import { getStatsSortieParRegionsEtNiveauDiplomeQuery } from "@/modules/data/queries/getStatsSortie/getStatsSortie";

import type { Filters } from "./deps/getDemandesRestitutionIntentions.query";
import { getDemandesRestitutionIntentionsQuery } from "./deps/getDemandesRestitutionIntentions.query";
import { getFilters } from "./deps/getFilters.query";

export interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

const getDemandesRestitutionIntentionsFactory =
  (
    deps = {
      getDemandesRestitutionIntentionsQuery: getDemandesRestitutionIntentionsQuery,
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
