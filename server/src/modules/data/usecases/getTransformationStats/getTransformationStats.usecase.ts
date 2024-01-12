import _ from "lodash";

import { dependencies } from "./dependencies";
import { QuerySchema } from "./getTransformationsStats.schema";

type DataScoped = Awaited<ReturnType<typeof dependencies.getScopedData>>[0];

const formatDataScoped = (item: DataScoped) => ({
  ...item,
  countDemande: item.countDemande || 0,
  placesOuvertesScolaire: item.placesOuvertesScolaire || 0,
  placesOuvertesApprentissage: item.placesOuvertesApprentissage || 0,
  placesOuvertes:
    item.placesOuvertesScolaire + item.placesOuvertesApprentissage || 0,
  placesFermeesScolaire: item.placesFermeesScolaire || 0,
  placesFermeesApprentissage: item.placesFermeesApprentissage || 0,
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
  differenceCapaciteScolaire: item.differenceCapaciteScolaire || 0,
  differenceCapaciteApprentissage: item.differenceCapaciteApprentissage || 0,
  placesTransformees:
    item.placesOuvertesScolaire +
      item.placesOuvertesApprentissage +
      item.placesFermeesScolaire || 0,
});

const getEffectif = (
  effectifs: Awaited<ReturnType<typeof dependencies.getEffectif>>,
  code: string | undefined
) => {
  if (!code) {
    return 0;
  }
  return effectifs.find((item) => item.code === code)?.effectif || 0;
};

const formatResult = (
  result: Awaited<ReturnType<typeof dependencies.getScopedData>>,
  effectifs: Awaited<ReturnType<typeof dependencies.getEffectif>>,
  order: "asc" | "desc" = "asc",
  orderBy?: string
) => {
  return _.chain(result)
    .map((item) => ({
      ...formatDataScoped(item),
      code: item.code,
      key: `_${item.code}`,
      tauxTransformation:
        Math.round(
          (item.transformes / getEffectif(effectifs, item.code) || 0) * 10000
        ) / 100,
      effectif: getEffectif(effectifs, item.code),
    }))
    .orderBy((item) => {
      if (orderBy) return item[orderBy as keyof typeof item];
      return item.libelle;
    }, order)
    .keyBy("key")
    .value();
};

const getTransformationStatsFactory =
  (
    deps = {
      getFiltersQuery: dependencies.getFiltersQuery,
      getScopedData: dependencies.getScopedData,
      getEffectif: dependencies.getEffectif,
    }
  ) =>
  async (activeFilters: QuerySchema) => {
    const [effectifs, filters, draft, submitted, all] = await Promise.all([
      deps.getEffectif({ ...activeFilters }),
      deps.getFiltersQuery(activeFilters),
      deps.getScopedData({
        ...activeFilters,
        status: "draft",
        scope: activeFilters.scope,
      }),
      deps.getScopedData({
        ...activeFilters,
        status: "submitted",
        scope: activeFilters.scope,
      }),
      deps.getScopedData({
        ...activeFilters,
        scope: activeFilters.scope,
      }),
    ]);

    return {
      submitted: formatResult(
        submitted,
        effectifs,
        activeFilters.order,
        activeFilters.orderBy
      ),
      draft: formatResult(
        draft,
        effectifs,
        activeFilters.order,
        activeFilters.orderBy
      ),
      all: formatResult(
        all,
        effectifs,
        activeFilters.order,
        activeFilters.orderBy
      ),
      filters,
    };
  };

export const getTransformationStats = getTransformationStatsFactory();
