import { chain } from "lodash-es";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";

import { getCurrentCampagneQuery } from "@/modules/data/queries/getCurrentCampagne/getCurrentCampagne.query";

import { getFiltersQuery } from "./deps/getFilters.query";
import type { Filters } from "./deps/getStatsPilotageIntentions.query";
import { getStatsPilotageIntentionsQuery } from "./deps/getStatsPilotageIntentions.query";

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
      getStatsPilotageIntentionsQuery: getStatsPilotageIntentionsQuery,
      getFiltersQuery: getFiltersQuery,
      getCurrentCampagneQuery,
    }
  ) =>
  async (activeFilters: ActiveFilters) => {
    const currentCampagne = await getCurrentCampagneQuery();
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
