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
      effectif: effectifNational || 0,
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
        effectif: effectifsRegions[items[0].region.codeRegion ?? ""] || 0,
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
        effectif: effectifsAcademie[items[0].academie.codeAcademie ?? ""] || 0,
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
        effectif:
          effectifsDepartements[items[0].departement.codeDepartement ?? ""] ||
          0,
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
    CPC?: string[];
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
  "01": 3736,
  "02": 3021,
  "03": 3697,
  "04": 8676,
  "06": 2851,
  "11": 63504,
  "24": 12272,
  "27": 13306,
  "28": 16437,
  "32": 40284,
  "44": 29463,
  "52": 19023,
  "53": 17049,
  "75": 27213,
  "76": 29010,
  "84": 39007,
  "93": 25710,
  "94": 1085,
};

const effectifNational = Object.values(effectifsRegions).reduce(
  (acc, cur) => acc + cur,
  0
);

const effectifsAcademie: Record<string, number> = {
  "01": 12451,
  "02": 16066,
  "03": 6035,
  "04": 16142,
  "06": 6938,
  "07": 7271,
  "08": 15711,
  "09": 28808,
  "10": 16358,
  "11": 14440,
  "12": 13159,
  "13": 7635,
  "14": 17049,
  "15": 8915,
  "16": 14570,
  "17": 19023,
  "18": 12272,
  "19": 7389,
  "20": 11476,
  "22": 3436,
  "23": 9644,
  "24": 25037,
  "25": 26016,
  "27": 1085,
  "28": 8676,
  "31": 3021,
  "32": 3736,
  "33": 3697,
  "43": 2851,
  "70": 16437,
};

const effectifsDepartements: Record<string, number> = {
  "001": 2204,
  "002": 3812,
  "003": 1789,
  "004": 624,
  "005": 593,
  "006": 5190,
  "007": 1696,
  "008": 1516,
  "009": 685,
  "010": 1674,
  "011": 1688,
  "012": 1078,
  "013": 11935,
  "014": 3518,
  "015": 593,
  "016": 1638,
  "017": 2472,
  "018": 1554,
  "019": 1049,
  "021": 2761,
  "022": 3152,
  "023": 610,
  "024": 1586,
  "025": 2737,
  "026": 2675,
  "027": 2459,
  "028": 1997,
  "029": 4643,
  "02A": 511,
  "02B": 574,
  "030": 4403,
  "031": 6993,
  "032": 657,
  "033": 7778,
  "034": 5325,
  "035": 5445,
  "036": 774,
  "037": 2824,
  "038": 6069,
  "039": 1566,
  "040": 1737,
  "041": 1481,
  "042": 4218,
  "043": 940,
  "044": 7355,
  "045": 3642,
  "046": 690,
  "047": 1416,
  "048": 664,
  "049": 4024,
  "050": 1991,
  "051": 3280,
  "052": 919,
  "053": 1647,
  "054": 4173,
  "055": 930,
  "056": 3809,
  "057": 6156,
  "058": 1025,
  "059": 18572,
  "060": 4126,
  "061": 1167,
  "062": 10236,
  "063": 3616,
  "064": 3625,
  "065": 1340,
  "066": 2360,
  "067": 5360,
  "068": 3555,
  "069": 9936,
  "070": 1017,
  "071": 2276,
  "072": 3018,
  "073": 2130,
  "074": 3141,
  "075": 12451,
  "076": 7302,
  "077": 7659,
  "078": 6087,
  "079": 1364,
  "080": 3538,
  "081": 1935,
  "082": 1192,
  "083": 4454,
  "084": 2914,
  "085": 2979,
  "086": 2161,
  "087": 1777,
  "088": 1900,
  "089": 1209,
  "090": 715,
  "091": 6993,
  "092": 5824,
  "093": 9627,
  "094": 7751,
  "095": 7112,
  "971": 3408,
  "972": 3021,
  "973": 3697,
  "974": 8676,
  "976": 2851,
  "978": 328,
};
