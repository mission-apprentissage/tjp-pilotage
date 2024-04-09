import _ from "lodash";

import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import {
  dependencies,
  GetScopedStatsPilotageIntentionsType,
} from "./dependencies";
import { QuerySchema } from "./getStatsPilotageIntentions.schema";

const formatTauxTransformation = (
  transformes: number,
  effectif: number | undefined
) => {
  if (typeof effectif === "undefined") {
    return undefined;
  }

  if (effectif === 0) return 0;

  return Math.round((transformes / effectif) * 10000) / 100;
};

const formatResult = (
  result: GetScopedStatsPilotageIntentionsType,
  order: "asc" | "desc" = "asc",
  orderBy?: string
) => {
  return _.chain(result)
    .map((item) => ({
      ...item,
      key: `_${item.code}`,
      libelle: item.libelle,
      code: item.code,
      placesTransformees:
        item.placesOuvertesScolaire +
          item.placesOuvertesApprentissage +
          item.placesFermeesScolaire || 0,
      placesOuvertesScolaire: item.placesOuvertesScolaire || 0,
      placesFermeesScolaire: item.placesFermeesScolaire || 0,
      placesOuvertesApprentissage: item.placesOuvertesApprentissage || 0,
      placesFermeesApprentissage: item.placesFermeesApprentissage || 0,
      placesOuvertes:
        item.placesOuvertesScolaire + item.placesOuvertesApprentissage || 0,
      placesFermees: item.placesFermeesScolaire || 0,
      ratioOuverture:
        Math.round(
          ((item.placesOuvertesScolaire + item.placesOuvertesApprentissage) /
            (item.placesOuvertesScolaire +
              item.placesOuvertesApprentissage +
              item.placesFermeesScolaire) || 0) * 10000
        ) / 100,
      ratioFermeture:
        Math.round(
          (item.placesFermeesScolaire /
            (item.placesOuvertesScolaire +
              item.placesOuvertesApprentissage +
              item.placesFermeesScolaire) || 0) * 10000
        ) / 100,
      tauxTransformation: formatTauxTransformation(
        item.transformes,
        item.effectif
      ),
      effectif: item.effectif,
    }))
    .orderBy((item) => {
      if (orderBy) return item[orderBy as keyof typeof item];
      return item.libelle;
    }, order)
    .keyBy("key")
    .value();
};

const getStatsPilotageIntentionsFactory =
  (
    deps = {
      getStatsPilotageIntentionsQuery:
        dependencies.getStatsPilotageIntentionsQuery,
      getFiltersQuery: dependencies.getFiltersQuery,
      getCurrentCampagneQuery,
    }
  ) =>
  async (activeFilters: QuerySchema) => {
    const currentCampagne = await getCurrentCampagneQuery();
    const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee;
    const [filters, draft, submitted, all] = await Promise.all([
      deps.getFiltersQuery({
        ...activeFilters,
        anneeCampagne,
      }),
      deps.getStatsPilotageIntentionsQuery({
        ...activeFilters,
        statut: "draft",
        anneeCampagne,
      }),
      deps.getStatsPilotageIntentionsQuery({
        ...activeFilters,
        statut: "submitted",
        anneeCampagne,
      }),
      deps.getStatsPilotageIntentionsQuery({
        ...activeFilters,
        anneeCampagne,
      }),
    ]);

    return {
      draft: formatResult(draft, activeFilters.order, activeFilters.orderBy),
      submitted: formatResult(
        submitted,
        activeFilters.order,
        activeFilters.orderBy
      ),
      all: formatResult(all, activeFilters.order, activeFilters.orderBy),
      campagne: currentCampagne,
      filters,
    };
  };

export const getStatsPilotageIntentionsUsecase =
  getStatsPilotageIntentionsFactory();
