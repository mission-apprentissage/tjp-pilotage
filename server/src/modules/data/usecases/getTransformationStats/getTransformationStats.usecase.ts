import { inject } from "injecti";
import _ from "lodash";

import {
  getFiltersQuery,
  getTransformationStatsQuery,
} from "./getTransformationStatsQuery.dep";

const formatResult = (
  result: Awaited<ReturnType<typeof getTransformationStatsQuery>>
) => {
  return {
    national: {
      ...result[0]?.national,
      tauxTransformation:
        Math.round(
          (result[0]?.national.transformes / effectifNational || 0) * 10000
        ) / 100,
    },
    regions: _.chain(result)
      .groupBy((item) => item.region.codeRegion)
      .mapValues((items) => ({
        ...items[0].region,
        countDemande: items[0].region.countDemande | 0,
        placesOuvertesScolaire: items[0].region.placesOuvertesScolaire | 0,
        placesOuvertesApprentissage:
          items[0].region.placesOuvertesApprentissage | 0,
        placesFermeesScolaire: items[0].region.placesFermeesScolaire | 0,
        placesFermeesApprentissage:
          items[0].region.placesFermeesApprentissage | 0,
        differenceCapaciteScolaire:
          items[0].region.differenceCapaciteScolaire | 0,
        differenceCapaciteApprentissage:
          items[0].region.differenceCapaciteApprentissage | 0,
        tauxTransformation:
          Math.round(
            (items[0].region.transforme /
              effectifsRegions[items[0].region.codeRegion ?? ""] || 0) * 10000
          ) / 100,
      }))
      .value(),
    academies: _.chain(result)
      .groupBy((item) => item.academie.codeAcademie)
      .mapValues((items) => ({
        ...items[0].academie,
        countDemande: items[0].academie.countDemande | 0,
        placesOuvertesScolaire: items[0].academie.placesOuvertesScolaire | 0,
        placesOuvertesApprentissage:
          items[0].academie.placesOuvertesApprentissage | 0,
        placesFermeesScolaire: items[0].academie.placesFermeesScolaire | 0,
        placesFermeesApprentissage:
          items[0].academie.placesFermeesApprentissage | 0,
        differenceCapaciteScolaire:
          items[0].academie.differenceCapaciteScolaire | 0,
        differenceCapaciteApprentissage:
          items[0].academie.differenceCapaciteApprentissage | 0,
        tauxTransformation:
          Math.round(
            (items[0].academie.transforme /
              effectifsAcademie[items[0].academie.codeAcademie ?? ""] || 0) *
              10000
          ) / 100,
      }))
      .value(),
    departements: _.chain(result)
      .groupBy((item) => item.departement.codeDepartement)
      .mapValues((items) => ({
        ...items[0].departement,
        countDemande: items[0].departement.countDemande | 0,
        placesOuvertesScolaire: items[0].departement.placesOuvertesScolaire | 0,
        placesOuvertesApprentissage:
          items[0].departement.placesOuvertesApprentissage | 0,
        placesFermeesScolaire: items[0].departement.placesFermeesScolaire | 0,
        placesFermeesApprentissage:
          items[0].departement.placesFermeesApprentissage | 0,
        differenceCapaciteScolaire:
          items[0].departement.differenceCapaciteScolaire | 0,
        differenceCapaciteApprentissage:
          items[0].departement.differenceCapaciteApprentissage | 0,
        tauxTransformation:
          Math.round(
            (items[0].departement.transforme /
              effectifsDepartements[
                items[0].departement.codeDepartement ?? ""
              ] || 0) * 10000
          ) / 100,
      }))
      .value(),
  };
};

export const [getTransformationStats] = inject(
  { getTransformationStatsQuery, getFiltersQuery },
  (deps) => async () => {
    const resultDraft = await deps
      .getTransformationStatsQuery({
        status: "draft",
      })
      .then(formatResult);
    const resultSubmitted = await deps
      .getTransformationStatsQuery({
        status: "submitted",
      })
      .then(formatResult);
    const resultAll = await deps
      .getTransformationStatsQuery({})
      .then(formatResult);

    const filters = await deps.getFiltersQuery().then();

    return {
      submitted: resultSubmitted,
      draft: resultDraft,
      all: resultAll,
      filters: filters,
    };
  }
);

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
  "05": 16550,
  "09": 29133,
  "08": 15823,
  "07": 7344,
  "06": 7082,
  "04": 16293,
  "03": 6164,
  "02": 16244,
  "01": 13290,
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