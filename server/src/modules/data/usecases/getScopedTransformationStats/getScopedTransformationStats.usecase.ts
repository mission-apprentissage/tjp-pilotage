import _ from "lodash";

import { GetScopedTransformationStatsType, dependencies } from "./dependencies";
import { QuerySchema } from "./getScopedTransformationStats.schema";

const getTauxTransformation = (
  transformes: number,
  effectif: number | undefined
) => {
  if (!effectif) {
    return undefined;
  }

  return Math.round((transformes / (effectif || 0)) * 10000) / 100;
};

const formatResult = (
  result: GetScopedTransformationStatsType,
  order: "asc" | "desc" = "asc",
  orderBy?: string
) => {
  return _.chain(result)
    .map((item) => ({
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
          ((item.placesFermeesScolaire + item.placesFermeesApprentissage) /
            (item.placesOuvertesScolaire +
              item.placesOuvertesApprentissage +
              item.placesFermeesScolaire +
              item.placesFermeesApprentissage) || 0) * 10000
        ) / 100,
      tauxTransformation: getTauxTransformation(
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

const getScopedTransformationStatsFactory =
  (
    deps = {
      getAcademieDatas: dependencies.getAcademieDatas,
      getRegionDatas: dependencies.getRegionDatas,
      getDepartementDatas: dependencies.getDepartementDatas,
    }
  ) =>
  async (activeFilters: QuerySchema) => {
    console.log("activeFilters", activeFilters);
    const results: GetScopedTransformationStatsType = [];

    switch (activeFilters.scope) {
      case "departements":
        results.push(...(await deps.getDepartementDatas(activeFilters)));
        break;
      case "academies":
        results.push(...(await deps.getAcademieDatas(activeFilters)));
        break;
      default:
        results.push(...(await deps.getRegionDatas(activeFilters)));
    }

    return formatResult(results, activeFilters.order, activeFilters.orderBy);
  };

export const getScopedTransformationStats =
  getScopedTransformationStatsFactory();
