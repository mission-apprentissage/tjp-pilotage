import _ from "lodash";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { getFiltersQuery } from "./deps/getFilters.query";
import { getStatsPilotageIntentionsQuery } from "./deps/getStatsPilotageIntentions.query";
import { getStatsPilotageIntentionsSchema } from "./getStatsPilotageIntentions.schema";

export type Filters = z.infer<
  typeof getStatsPilotageIntentionsSchema.querystring
>;

export type GetScopedStatsPilotageIntentionsType = Awaited<
  ReturnType<typeof getStatsPilotageIntentionsQuery>
>;

const formatResult = (result: GetScopedStatsPilotageIntentionsType) => {
  return _.chain(result)
    .map((item) => ({
      ...item,
      key: `_${item.code}`,
      libelle: item.libelle,
      code: item.code,
      ratioFermeture: item.placesTransformees
        ? (item.placesFermees || 0) / item.placesTransformees
        : undefined,
      ratioOuverture: item.placesTransformees
        ? (item.placesOuvertes || 0) / item.placesTransformees
        : undefined,
      tauxTransformation: item.effectif
        ? item.placesTransformees / item.effectif
        : undefined,
      effectif: item.effectif,
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
  async (activeFilters: Filters) => {
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

export const getStatsPilotageIntentionsUsecase =
  getStatsPilotageIntentionsFactory();
