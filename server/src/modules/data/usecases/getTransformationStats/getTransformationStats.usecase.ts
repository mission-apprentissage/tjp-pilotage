import _ from "lodash";

import { dependencies } from "./dependencies";

type DataTerritoire = Awaited<
  ReturnType<typeof dependencies.getTransformationStatsQuery>
>[0]["region" | "academie" | "departement"];

const formatTerritoire = (item: DataTerritoire) => ({
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

const formatResult = (
  result: Awaited<ReturnType<typeof dependencies.getTransformationStatsQuery>>,
  orderBy?: { column: string; order: "asc" | "desc" }
) => {
  return {
    national: {
      ...result[0]?.national,
      countDemande: result[0]?.national.countDemande || 0,
      placesOuvertesScolaire: result[0]?.national.placesOuvertesScolaire || 0,
      placesOuvertesApprentissage:
        result[0]?.national.placesOuvertesApprentissage || 0,
      placesOuvertes:
        result[0]?.national.placesOuvertesScolaire +
          result[0]?.national.placesOuvertesApprentissage || 0,
      placesFermeesScolaire: result[0]?.national.placesFermeesScolaire || 0,
      placesFermeesApprentissage:
        result[0]?.national.placesFermeesApprentissage || 0,
      placesFermees:
        result[0]?.national.placesFermeesScolaire +
          result[0]?.national.placesFermeesApprentissage || 0,
      ratioFermeture:
        Math.round(
          ((result[0]?.national.placesFermeesScolaire +
            result[0]?.national.placesFermeesApprentissage) /
            (result[0]?.national.placesOuvertesScolaire +
              result[0]?.national.placesOuvertesApprentissage +
              result[0]?.national.placesFermeesScolaire +
              result[0]?.national.placesFermeesApprentissage) || 0) * 10000
        ) / 100,
      ratioOuverture:
        Math.round(
          ((result[0]?.national.placesOuvertesScolaire +
            result[0]?.national.placesOuvertesApprentissage) /
            (result[0]?.national.placesOuvertesScolaire +
              result[0]?.national.placesOuvertesApprentissage +
              result[0]?.national.placesFermeesScolaire +
              result[0]?.national.placesFermeesApprentissage) || 0) * 10000
        ) / 100,
      differenceCapaciteScolaire:
        result[0]?.national.differenceCapaciteScolaire || 0,
      differenceCapaciteApprentissage:
        result[0]?.national.differenceCapaciteApprentissage || 0,
      placesTransformees:
        result[0]?.national.differenceCapaciteScolaire +
          result[0]?.national.differenceCapaciteApprentissage || 0,
      tauxTransformation:
        Math.round(
          (result[0]?.national.transformes / effectifNational || 0) * 10000
        ) / 100,
    },
    regions: _.chain(result)
      .groupBy((item) => item.region.codeRegion)
      .mapValues((items) => ({
        ...formatTerritoire(items[0].region),
        code: `_${items[0].region.codeRegion}`,
        tauxTransformation:
          Math.round(
            (items[0].region.transforme /
              effectifsRegions[items[0].region.codeRegion ?? ""] || 0) * 10000
          ) / 100,
      }))
      .orderBy(
        (item) => {
          if (orderBy && orderBy.column)
            return item[orderBy.column as keyof typeof item];
          return item.libelle;
        },
        orderBy?.order ?? "asc"
      )
      .keyBy("code")
      .value(),
    academies: _.chain(result)
      .groupBy((item) => item.academie.codeAcademie)
      .mapValues((items) => ({
        ...formatTerritoire(items[0].academie),
        code: `_${items[0].academie.codeAcademie}`,
        tauxTransformation:
          Math.round(
            (items[0].academie.transforme /
              effectifsAcademie[items[0].academie.codeAcademie ?? ""] || 0) *
              10000
          ) / 100,
      }))
      .orderBy(
        (item) => {
          if (orderBy && orderBy.column)
            return item[orderBy.column as keyof typeof item];
          return item.libelle;
        },
        orderBy?.order ?? "asc"
      )
      .keyBy("code")
      .value(),
    departements: _.chain(result)
      .groupBy((item) => item.departement.codeDepartement)
      .mapValues((items) => ({
        ...formatTerritoire(items[0].departement),
        code: `_${items[0].departement.codeDepartement}`,
        tauxTransformation:
          Math.round(
            (items[0].departement.transforme /
              effectifsDepartements[
                items[0].departement.codeDepartement ?? ""
              ] || 0) * 10000
          ) / 100,
      }))
      .orderBy(
        (item) => {
          if (orderBy && orderBy.column)
            return item[orderBy.column as keyof typeof item];
          return item.libelle;
        },
        orderBy?.order ?? "asc"
      )
      .keyBy("code")
      .value(),
  };
};

const getTransformationStatsFactory =
  (
    deps = {
      getTransformationStatsQuery: dependencies.getTransformationStatsQuery,
      getFiltersQuery: dependencies.getFiltersQuery,
    }
  ) =>
  async (activeFilters: {
    rentreeScolaire?: string;
    codeNiveauDiplome?: string[];
    filiere?: string[];
    orderBy?: { column: string; order: "asc" | "desc" };
  }) => {
    const resultDraft = await deps
      .getTransformationStatsQuery({
        ...activeFilters,
        status: "draft",
      })
      .then((result) => formatResult(result, activeFilters.orderBy));

    const resultSubmitted = await deps
      .getTransformationStatsQuery({
        ...activeFilters,
        status: "submitted",
      })
      .then((result) => formatResult(result, activeFilters.orderBy));

    const resultAll = await deps
      .getTransformationStatsQuery({
        ...activeFilters,
      })
      .then((result) => formatResult(result, activeFilters.orderBy));

    const filters = await deps.getFiltersQuery(activeFilters);

    return {
      submitted: resultSubmitted,
      draft: resultDraft,
      all: resultAll,
      filters: filters,
    };
  };

export const getTransformationStats = getTransformationStatsFactory();

const effectifsRegions: Record<string, number> = {
  "11": 64809,
  "24": 12393,
  "27": 13508,
  "28": 16550,
  "32": 40695,
  "44": 29744,
  "52": 19166,
  "53": 17239,
  "75": 27530,
  "76": 29322,
  "84": 39462,
  "93": 26079,
  "94": 1085,
  "06": 2851,
  "04": 8708,
  "03": 3697,
  "02": 3061,
  "01": 3751,
};

const effectifNational = Object.values(effectifsRegions).reduce(
  (acc, cur) => acc + cur,
  0
);

const effectifsAcademie: Record<string, number> = {
  "10": 16557,
  "11": 14542,
  "12": 13266,
  "13": 7720,
  "14": 17239,
  "15": 9027,
  "16": 14780,
  "17": 19166,
  "18": 12393,
  "19": 7451,
  "20": 11562,
  "22": 3517,
  "23": 9835,
  "24": 25300,
  "25": 26219,
  "27": 1085,
  "28": 8708,
  "31": 3061,
  "32": 3751,
  "33": 3697,
  "43": 2851,
  "09": 29133,
  "08": 15823,
  "07": 7344,
  "06": 7082,
  "04": 16293,
  "03": 6164,
  "02": 16244,
  "01": 13290,
  "70": 16550,
};

const effectifsDepartements: Record<string, number> = {
  "971": 3423,
  "972": 3061,
  "973": 3697,
  "974": 8708,
  "976": 2851,
  "978": 328,
  "095": 7168,
  "094": 7879,
  "093": 9700,
  "092": 5905,
  "091": 7023,
  "090": 715,
  "089": 1209,
  "088": 1912,
  "087": 1777,
  "086": 2161,
  "085": 3023,
  "084": 2914,
  "083": 4550,
  "082": 1192,
  "081": 1947,
  "080": 3579,
  "079": 1383,
  "078": 6123,
  "077": 7721,
  "076": 7375,
  "075": 13290,
  "074": 3167,
  "073": 2130,
  "072": 3033,
  "071": 2288,
  "070": 1017,
  "069": 10107,
  "068": 3571,
  "067": 5456,
  "066": 2360,
  "065": 1340,
  "064": 3653,
  "063": 3663,
  "062": 10290,
  "061": 1180,
  "060": 4126,
  "059": 18843,
  "058": 1070,
  "057": 6200,
  "056": 3809,
  "055": 930,
  "054": 4224,
  "053": 1647,
  "052": 965,
  "051": 3296,
  "050": 1991,
  "049": 4054,
  "048": 689,
  "047": 1416,
  "046": 722,
  "045": 3657,
  "044": 7409,
  "043": 940,
  "042": 4246,
  "041": 1512,
  "040": 1737,
  "039": 1619,
  "038": 6142,
  "037": 2887,
  "036": 774,
  "035": 5505,
  "034": 5387,
  "033": 7901,
  "032": 657,
  "031": 7159,
  "030": 4418,
  "029": 4741,
  "028": 1997,
  "027": 2459,
  "026": 2688,
  "025": 2813,
  "024": 1586,
  "023": 691,
  "022": 3184,
  "021": 2777,
  "019": 1049,
  "018": 1566,
  "017": 2487,
  "016": 1689,
  "015": 648,
  "014": 3545,
  "013": 12113,
  "012": 1078,
  "011": 1688,
  "010": 1674,
  "009": 685,
  "008": 1516,
  "007": 1696,
  "006": 5285,
  "005": 593,
  "004": 624,
  "003": 1831,
  "002": 3857,
  "001": 2204,
  "02B": 574,
  "02A": 511,
};
