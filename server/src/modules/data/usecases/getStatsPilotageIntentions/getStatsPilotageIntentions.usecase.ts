import _ from "lodash";
import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import { z } from "zod";

import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { formatTauxTransformation } from "../../utils/formatTauxTransformation";
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
      placesTransformees:
        item.placesOuvertesScolaire +
          item.placesOuvertesApprentissage +
          item.placesFermeesScolaire +
          item.placesFermeesApprentissage || 0,
      placesOuvertesScolaire: item.placesOuvertesScolaire || 0,
      placesFermeesScolaire: item.placesFermeesScolaire || 0,
      placesOuvertesApprentissage: item.placesOuvertesApprentissage || 0,
      placesFermeesApprentissage: item.placesFermeesApprentissage || 0,
      placesOuvertes: item.placesOuvertes || 0,
      placesOuvertesQ1Q2:
        item.placesOuvertesScolaireQ1Q2 +
          item.placesOuvertesApprentissageQ1Q2 || 0,
      placesOuvertesTransformationEcologique:
        item.placesOuvertesTransformationEcologique || 0,
      placesFermees:
        item.placesFermeesScolaire + item.placesFermeesApprentissage || 0,
      placesFermeesQ3Q4:
        item.placesFermeesScolaireQ3Q4 + item.placesFermeesApprentissageQ3Q4 ||
        0,
      placesOuvertesColorees: item.placeOuvertesColorees || 0,
      placesOuvertesColoreesQ3Q4: item.placesOuvertesColoreesQ3Q4 || 0,
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
