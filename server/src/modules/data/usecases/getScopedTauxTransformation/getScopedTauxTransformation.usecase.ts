import _ from "lodash";

import { GetScopedTauxTransformationType, dependencies } from "./dependencies";
import { QuerySchema, Scope } from "./getScopedTauxTransformation.schema";

const formatResult = (
  scope: Scope,
  result: GetScopedTauxTransformationType,
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
      tauxTransformation: 0,
      effectif: 0,
    }))
    .orderBy((item) => {
      if (orderBy) return item[orderBy as keyof typeof item];
      return item.libelle;
    }, order)
    .keyBy("key")
    .value();
};

const getScopedTauxTransformationFactory =
  (
    deps = {
      getAcademieDatas: dependencies.getAcademieDatas,
      getRegionDatas: dependencies.getRegionDatas,
      getDepartementDatas: dependencies.getDepartementDatas,
    }
  ) =>
  async (activeFilters: QuerySchema) => {
    const results: GetScopedTauxTransformationType = [];

    switch (activeFilters.scope) {
      case "departements":
        results.push(...(await deps.getDepartementDatas(activeFilters)));
      case "academies":
        results.push(...(await deps.getAcademieDatas(activeFilters)));
      default:
        results.push(...(await deps.getRegionDatas(activeFilters)));
    }

    return formatResult(
      activeFilters.scope,
      results,
      activeFilters.order,
      activeFilters.orderBy
    );
  };

export const getScopedTauxTransformation = getScopedTauxTransformationFactory();
