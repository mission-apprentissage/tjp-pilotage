import { chain } from "lodash-es";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type {FiltersSchema} from 'shared/routes/schemas/get.pilotage-intentions.stats.schema';
import type {z} from 'zod';

import type { RequestUser } from "@/modules/core/model/User";
import { getCurrentCampagne } from "@/modules/utils/getCurrentCampagne";

import { getFiltersQuery } from "./deps/getFilters.query";
import { getStatsPilotageIntentionsQuery } from "./deps/getStatsPilotageIntentions.query";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  campagne: string;
}

interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

export type GetScopedStatsPilotageIntentionsType = Awaited<ReturnType<typeof getStatsPilotageIntentionsQuery>>;

const formatResult = (result: GetScopedStatsPilotageIntentionsType) => {
  return chain(result)
    .map((item) => ({
      ...item,
      key: `_${item.code}`,
      ratioFermeture:
        item.placesFermees && item.placesOuvertes
          ? item.placesFermees / (item.placesFermees + item.placesOuvertes)
          : undefined,
      ratioOuverture:
        item.placesFermees && item.placesOuvertes
          ? item.placesOuvertes / (item.placesFermees + item.placesOuvertes)
          : undefined,
      tauxTransformation: item.effectif ? item.placesTransformees / item.effectif : undefined,
    }))
    .keyBy("key")
    .value();
};

const getStatsPilotageIntentionsFactory =
  (
    deps = {
      getStatsPilotageIntentionsQuery,
      getFiltersQuery,
      getCurrentCampagne,
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const currentCampagne = await getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee;
      const [filters, projets, validees, all] = await Promise.all([
        deps.getFiltersQuery({
          ...activeFilters,
          campagne: anneeCampagne,
        }),
        deps.getStatsPilotageIntentionsQuery({
          ...activeFilters,
          statut: [DemandeStatutEnum["projet de demande"]],
          campagne: anneeCampagne,
        }),
        deps.getStatsPilotageIntentionsQuery({
          ...activeFilters,
          statut: [DemandeStatutEnum["demande validée"]],
          campagne: anneeCampagne,
        }),
        deps.getStatsPilotageIntentionsQuery({
          ...activeFilters,
          campagne: anneeCampagne,
        }),
      ]);

      return {
        ["projet de demande"]: formatResult(projets),
        ["demande validée"]: formatResult(validees),
        all: formatResult(all),
        campagne: currentCampagne,
        filters,
      };
    };

export const getStatsPilotageIntentionsUsecase = getStatsPilotageIntentionsFactory();
