import _ from "lodash";

import { EffectifParDiplome } from "./data/dataEffectif.schema";
import { effectifsAcademie as effectifsAc } from "./data/dataEffectifAcademie";
import { effectifDepartement } from "./data/dataEffectifDepartement";
import { effectifRegion } from "./data/dataEffectifRegion";
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

const formatNationalResult = ({
  countDemande = 0,
  transformes = 0,
  differenceCapaciteScolaire = 0,
  differenceCapaciteApprentissage = 0,
  placesOuvertesScolaire = 0,
  placesFermeesScolaire = 0,
  placesOuvertesApprentissage = 0,
  placesFermeesApprentissage = 0,
  codeNiveauDiplomes,
}: {
  countDemande: number;
  transformes: number;
  differenceCapaciteScolaire: number;
  differenceCapaciteApprentissage: number;
  placesOuvertesScolaire: number;
  placesFermeesScolaire: number;
  placesOuvertesApprentissage: number;
  placesFermeesApprentissage: number;
  codeNiveauDiplomes?: string[];
}) => {
  const ratioFermeture =
    Math.round(
      ((placesFermeesScolaire + placesFermeesApprentissage) /
        (placesOuvertesScolaire +
          placesOuvertesApprentissage +
          placesFermeesScolaire +
          placesFermeesApprentissage) || 0) * 10000
    ) / 100;

  const ratioOuverture =
    Math.round(
      ((placesOuvertesScolaire + placesOuvertesApprentissage) /
        (placesOuvertesScolaire +
          placesOuvertesApprentissage +
          placesFermeesScolaire +
          placesFermeesApprentissage) || 0) * 10000
    ) / 100;

  return {
    countDemande,
    placesOuvertesScolaire,
    placesOuvertesApprentissage,
    placesFermeesScolaire,
    placesFermeesApprentissage,
    ratioFermeture,
    ratioOuverture,
    transformes,
    differenceCapaciteScolaire,
    differenceCapaciteApprentissage,
    placesOuvertes: placesOuvertesScolaire + placesOuvertesApprentissage,
    placesFermees: placesFermeesScolaire + placesFermeesApprentissage,
    placesTransformees:
      differenceCapaciteScolaire + differenceCapaciteApprentissage,
    tauxTransformation: getTauxTransformation(
      transformes,
      getEffectifNationalByDiplomes(codeNiveauDiplomes)
    ),
    effectif: getEffectifNationalByDiplomes(codeNiveauDiplomes),
  };
};

const formatRegionsResult = (
  result: Awaited<ReturnType<typeof dependencies.getTransformationStatsQuery>>,
  orderBy?: { column: string; order: "asc" | "desc" },
  codeNiveauDiplomes?: string[]
) => {
  return _.chain(result)
    .groupBy((item) => item.region.codeRegion)
    .mapValues((items) => ({
      ...formatTerritoire(items[0].region),
      code: `_${items[0].region.codeRegion}`,
      tauxTransformation: getTauxTransformation(
        items[0].region.transforme,
        getEffectifByScaleByDiplomes(
          items[0].region.codeRegion,
          "regions",
          codeNiveauDiplomes
        )
      ),
      effectif: getEffectifByScaleByDiplomes(
        items[0].region.codeRegion,
        "regions",
        codeNiveauDiplomes
      ),
    }))
    .orderBy(
      (item) => {
        if (orderBy?.column) return item[orderBy.column as keyof typeof item];
        return item.libelle;
      },
      orderBy?.order ?? "asc"
    )
    .keyBy("code")
    .value();
};

const formatAcademiesResult = (
  result: Awaited<ReturnType<typeof dependencies.getTransformationStatsQuery>>,
  orderBy?: { column: string; order: "asc" | "desc" },
  codeNiveauDiplomes?: string[]
) => {
  return _.chain(result)
    .groupBy((item) => item.academie.codeAcademie)
    .mapValues((items) => ({
      ...formatTerritoire(items[0].academie),
      code: `_${items[0].academie.codeAcademie}`,
      tauxTransformation: getTauxTransformation(
        items[0].academie.transforme,
        getEffectifByScaleByDiplomes(
          items[0].academie.codeAcademie,
          "academies",
          codeNiveauDiplomes
        )
      ),
      effectif: getEffectifByScaleByDiplomes(
        items[0].academie.codeAcademie,
        "academies",
        codeNiveauDiplomes
      ),
    }))
    .orderBy(
      (item) => {
        if (orderBy?.column) return item[orderBy.column as keyof typeof item];
        return item.libelle;
      },
      orderBy?.order ?? "asc"
    )
    .keyBy("code")
    .value();
};

const formatDepartementsResult = (
  result: Awaited<ReturnType<typeof dependencies.getTransformationStatsQuery>>,
  orderBy?: { column: string; order: "asc" | "desc" },
  codeNiveauDiplomes?: string[]
) => {
  return _.chain(result)
    .groupBy((item) => item.departement.codeDepartement)
    .mapValues((items) => ({
      ...formatTerritoire(items[0].departement),
      code: `_${items[0].departement.codeDepartement}`,
      tauxTransformation: getTauxTransformation(
        items[0].departement.transforme,
        getEffectifByScaleByDiplomes(
          items[0].departement.codeDepartement,
          "departements",
          codeNiveauDiplomes
        )
      ),
      effectif: getEffectifByScaleByDiplomes(
        items[0].departement.codeDepartement,
        "departements",
        codeNiveauDiplomes
      ),
    }))
    .orderBy(
      (item) => {
        if (orderBy?.column) {
          return item[orderBy.column as keyof typeof item];
        }
        return item.libelle;
      },
      orderBy?.order ?? "asc"
    )
    .keyBy("code")
    .value();
};

export const getTauxTransformation = (
  transformes: number,
  effectif: number
) => {
  if (effectif === 0) {
    return 0;
  }
  return Math.round((transformes / effectif || 0) * 10000) / 100;
};

export const getEffectifNationalByDiplomes = (diplomes?: string[]): number => {
  if (diplomes?.length) {
    return diplomes.reduce((acc, codeNiveauDiplome) => {
      Object.values(effectifRegion).forEach((effectifParCodeNiveauDiplome) => {
        acc = acc + (effectifParCodeNiveauDiplome[codeNiveauDiplome]?.nb ?? 0);
      });
      return acc;
    }, 0);
  }

  return Object.values(effectifRegion).reduce(
    (acc, effectifParCodeNiveauDiplome) => {
      return Object.values(effectifParCodeNiveauDiplome).reduce(
        (accRegion, effectifParNiveauDiplome) =>
          accRegion + effectifParNiveauDiplome.nb,
        acc
      );
    },
    0
  );
};

export const getEffectifByScaleByDiplomes = (
  code: string | undefined,
  scale: "departements" | "academies" | "regions",
  diplomes?: string[]
): number => {
  if (!code) return 0;

  let effectifs: EffectifParDiplome | null = null;

  if (scale === "regions") {
    effectifs = effectifRegion[code];
  }

  if (scale === "academies") {
    effectifs = effectifsAc[code];
  }

  if (scale === "departements") {
    effectifs = effectifDepartement[code];
  }

  if (effectifs) {
    if (diplomes?.length) {
      return diplomes.reduce((acc, codeNiveauDiplome) => {
        return acc + (effectifs?.[codeNiveauDiplome]?.nb ?? 0);
      }, 0);
    }

    return Object.values(effectifs).reduce((acc, value) => acc + value.nb, 0);
  }

  return 0;
};

const formatResult = (
  result: Awaited<ReturnType<typeof dependencies.getTransformationStatsQuery>>,
  orderBy?: { column: string; order: "asc" | "desc" },
  codeNiveauDiplomes?: string[]
) => {
  return {
    national: formatNationalResult({
      ...result[0]?.national,
      codeNiveauDiplomes,
    }),
    regions: formatRegionsResult(result, orderBy, codeNiveauDiplomes),
    academies: formatAcademiesResult(result, orderBy, codeNiveauDiplomes),
    departements: formatDepartementsResult(result, orderBy, codeNiveauDiplomes),
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
      .then((result) =>
        formatResult(
          result,
          activeFilters.orderBy,
          activeFilters.codeNiveauDiplome
        )
      );

    const resultSubmitted = await deps
      .getTransformationStatsQuery({
        ...activeFilters,
        status: "submitted",
      })
      .then((result) =>
        formatResult(
          result,
          activeFilters.orderBy,
          activeFilters.codeNiveauDiplome
        )
      );

    const resultAll = await deps
      .getTransformationStatsQuery({
        ...activeFilters,
      })
      .then((result) =>
        formatResult(
          result,
          activeFilters.orderBy,
          activeFilters.codeNiveauDiplome
        )
      );

    const filters = await deps.getFiltersQuery(activeFilters);

    return {
      submitted: resultSubmitted,
      draft: resultDraft,
      all: resultAll,
      filters: filters,
    };
  };

export const getTransformationStats = getTransformationStatsFactory();
