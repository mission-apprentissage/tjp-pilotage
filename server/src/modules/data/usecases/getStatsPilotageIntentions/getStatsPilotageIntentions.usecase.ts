import _ from "lodash";
import {
  DemandeStatutEnum,
  DemandeStatutType,
} from "shared/enum/demandeStatutEnum";
import { z } from "zod";

import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { formatTauxTransformation } from "../../utils/formatTauxTransformation";
import { getFiltersQuery } from "./deps/getFilters.query";
import { getStatsPilotageIntentionsQuery } from "./deps/getStatsPilotageIntentions.query";
import { getStatsPilotageIntentionsSchema } from "./getStatsPilotageIntentions.schema";

export interface Filters
  extends z.infer<typeof getStatsPilotageIntentionsSchema.querystring> {
  statut?: Exclude<DemandeStatutType, "supprimée" | "refusée">;
}

export type GetScopedStatsPilotageIntentionsType = Awaited<
  ReturnType<typeof getStatsPilotageIntentionsQuery>
>;

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
          item.placesFermeesScolaire +
          item.placesFermeesApprentissage || 0,
      placesOuvertesScolaire: item.placesOuvertesScolaire || 0,
      placesFermeesScolaire: item.placesFermeesScolaire || 0,
      placesOuvertesApprentissage: item.placesOuvertesApprentissage || 0,
      placesFermeesApprentissage: item.placesFermeesApprentissage || 0,
      placesOuvertes:
        item.placesOuvertesScolaire + item.placesOuvertesApprentissage || 0,
      placesFermees:
        item.placesFermeesScolaire + item.placesFermeesApprentissage || 0,
      ratioOuverture:
        Math.round(
          ((item.placesOuvertesScolaire + item.placesOuvertesApprentissage) /
            (item.placesOuvertesScolaire +
              item.placesOuvertesApprentissage +
              item.placesFermeesScolaire +
              item.placesFermeesApprentissage) || 0) * 10000
        ) / 100,
      ratioFermeture:
        Math.round(
          (item.placesFermeesScolaire /
            (item.placesOuvertesScolaire +
              item.placesOuvertesApprentissage +
              item.placesFermeesScolaire +
              item.placesFermeesApprentissage) || 0) * 10000
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
      getStatsPilotageIntentionsQuery: getStatsPilotageIntentionsQuery,
      getFiltersQuery: getFiltersQuery,
      getCurrentCampagneQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const currentCampagne = await getCurrentCampagneQuery();
    const anneeCampagne = activeFilters.campagne ?? currentCampagne.annee;
    const [filters, propositions, validees, all] = await Promise.all([
      deps.getFiltersQuery({
        ...activeFilters,
        campagne: anneeCampagne,
      }),
      deps.getStatsPilotageIntentionsQuery({
        ...activeFilters,
        statut: DemandeStatutEnum["projet de demande"],
        campagne: anneeCampagne,
      }),
      deps.getStatsPilotageIntentionsQuery({
        ...activeFilters,
        statut: DemandeStatutEnum["demande validée"],
        campagne: anneeCampagne,
      }),
      deps.getStatsPilotageIntentionsQuery({
        ...activeFilters,
        campagne: anneeCampagne,
      }),
    ]);

    return {
      ["projet de demande"]: formatResult(
        propositions,
        activeFilters.order,
        activeFilters.orderBy
      ),
      ["demande validée"]: formatResult(
        validees,
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
