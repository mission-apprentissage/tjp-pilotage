import _ from "lodash";
import { z } from "zod";

import { RequestUser } from "../../../core/model/User";
import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { getDenominateurQuery } from "./deps/getDenominateurQuery";
import { getDomainesQuery } from "./deps/getDomainesQuery";
import { getNiveauxDiplomeQuery } from "./deps/getNiveauxDiplomeQuery";
import { getNumerateurQuery } from "./deps/getNumerateurQuery";
import { getPositionsQuadrantQuery } from "./deps/getPositionsQuadrantQuery";
import { getZonesGeographiquesQuery } from "./deps/getZonesGeographiquesQuery";
import {
  getRepartitionPilotageIntentionsSchema,
  StatsSchema,
} from "./getRepartitionPilotageIntentions.schema";

export interface Filters
  extends z.infer<typeof getRepartitionPilotageIntentionsSchema.querystring> {
  user: RequestUser;
}

type Numerateur = Awaited<ReturnType<typeof getNumerateurQuery>>;
type Denominateur = Awaited<ReturnType<typeof getDenominateurQuery>>;
type GroupByCodeLibelle =
  | { code: "codeRegion"; libelle: "libelleRegion" }
  | { code: "codeAcademie"; libelle: "libelleAcademie" }
  | { code: "codeDepartement"; libelle: "libelleDepartement" }
  | { code: "positionQuadrant"; libelle: "positionQuadrant" }
  | { code: "codeNsf"; libelle: "libelleNsf" }
  | { code: "codeNiveauDiplome"; libelle: "libelleNiveauDiplome" };

export type Repartition = {
  numerateur: Numerateur;
  denominateur: Denominateur;
  groupBy: GroupByCodeLibelle;
};

const calculateTotal = (
  statsRepartition: z.infer<typeof StatsSchema>[]
): z.infer<typeof StatsSchema>[] => {
  const total: z.infer<typeof StatsSchema> = {
    libelle: "Total",
    code: "total",
    effectif: 0,
    placesOuvertes: 0,
    placesFermees: 0,
    placesColorees: 0,
    placesTransformees: 0,
    solde: 0,
    tauxTransformation: undefined,
    ratioOuverture: undefined,
    ratioFermeture: undefined,
  };

  // Iterate through each entry and sum up the values
  Object.values(statsRepartition).forEach((stats) => {
    total.effectif += stats.effectif;
    total.placesOuvertes += stats.placesOuvertes;
    total.placesFermees += stats.placesFermees;
    total.placesColorees += stats.placesColorees;
    total.placesTransformees += stats.placesTransformees;
    total.solde += stats.solde;
  });

  if (total.effectif !== 0) {
    total.tauxTransformation = total.placesTransformees / total.effectif;
  }
  if (total.placesTransformees !== 0) {
    total.ratioOuverture = total.placesOuvertes / total.placesTransformees;
    total.ratioFermeture = total.placesFermees / total.placesTransformees;
  }

  // Add the "total" entry to the repartition
  return [...statsRepartition, total];
};

const formatResult = (
  result: z.infer<typeof StatsSchema>[],
  order: "asc" | "desc" = "desc",
  orderBy?: string
) => {
  return _.chain(calculateTotal(result))
    .map((item) => ({
      ...item,
      libelle: item.libelle ?? item.code,
      ratioFermeture: item.placesTransformees
        ? (item.placesFermees || 0) / item.placesTransformees
        : undefined,
      ratioOuverture: item.placesTransformees
        ? (item.placesOuvertes || 0) / item.placesTransformees
        : undefined,
      tauxTransformation: item.effectif
        ? item.placesTransformees / item.effectif
        : undefined,
    }))
    .orderBy((item) => {
      const value = orderBy ? item[orderBy as keyof typeof item] : item.libelle;

      return value === null || value === undefined ? 0 : value; // Treat null/undefined as 0
    }, order)
    .keyBy("libelle")
    .value();
};

const groupByResult = ({
  numerateur,
  denominateur,
  groupBy,
}: {
  numerateur: Numerateur;
  denominateur: Denominateur;
  groupBy: GroupByCodeLibelle;
}) => {
  const allKeys = _.union(
    _.keys(_(numerateur).groupBy(groupBy.code).value()),
    _.keys(_(denominateur).groupBy(groupBy.code).value())
  );

  return _(allKeys)
    .map((code) => {
      // Chercher les demandes associées
      const effectifGrouped = _.filter(denominateur, {
        [groupBy.code]: code,
      });
      // Chercher les demandes associées
      const demandeGrouped = _.filter(numerateur, {
        [groupBy.code]: code,
      });

      // Somme des effectifs
      const totalEffectifs = _.sumBy(effectifGrouped, "effectif");

      // Somme des placesOuvertes
      const sommePlacesOuvertes = _.sumBy(demandeGrouped, "placesOuvertes");
      const sommePlacesFermees = _.sumBy(demandeGrouped, "placesFermees");
      const sommePlacesColorees = _.sumBy(demandeGrouped, "placesColorees");
      const sommePlacesTransformees = _.sumBy(
        demandeGrouped,
        "placesTransformees"
      );
      const sommeSolde = sommePlacesOuvertes - sommePlacesFermees;
      const libelle =
        _.get(effectifGrouped[0], groupBy.libelle) ??
        _.get(demandeGrouped[0], groupBy.libelle);

      return {
        code: code,
        libelle: libelle ?? code,
        effectif: totalEffectifs,
        placesOuvertes: sommePlacesOuvertes,
        placesFermees: sommePlacesFermees,
        placesColorees: sommePlacesColorees,
        placesTransformees: sommePlacesTransformees,
        solde: sommeSolde,
      };
    })
    .value();
};

const getRepartitionPilotageIntentionsFactory =
  (
    deps = {
      getCurrentCampagneQuery,
      getDomainesQuery,
      getNiveauxDiplomeQuery,
      getZonesGeographiquesQuery,
      getPositionsQuadrantQuery,
      getDenominateurQuery,
      getNumerateurQuery,
    }
  ) =>
  async (activeFilters: Filters) => {
    const campagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters?.campagne ?? campagne.annee;
    const [domaines, niveauxDiplome, zonesGeographiques, positionsQuadrant] =
      await Promise.all([
        deps.getDomainesQuery({
          filters: {
            ...activeFilters,
            codeNsf: undefined,
            campagne: anneeCampagne,
          },
        }),
        deps.getNiveauxDiplomeQuery({
          filters: {
            ...activeFilters,
            codeNiveauDiplome: undefined,
            campagne: anneeCampagne,
          },
        }),
        deps.getZonesGeographiquesQuery({
          filters: {
            ...activeFilters,
            campagne: anneeCampagne,
          },
        }),
        deps.getPositionsQuadrantQuery({
          filters: {
            ...activeFilters,
            campagne: anneeCampagne,
          },
        }),
      ]);

    return {
      // Répartitions non ordonnées
      top10Domaines: formatResult(
        groupByResult(domaines),
        "desc",
        "placesTransformees"
      ),
      niveauxDiplome: formatResult(
        groupByResult(niveauxDiplome),
        "desc",
        "placesTransformees"
      ),
      // Répartitions ordonnées
      domaines: formatResult(
        groupByResult(domaines),
        activeFilters.order,
        activeFilters.orderBy
      ),
      zonesGeographiques: formatResult(
        groupByResult(zonesGeographiques),
        activeFilters.order,
        activeFilters.orderBy
      ),
      positionsQuadrant: formatResult(
        groupByResult(positionsQuadrant),
        activeFilters.order,
        activeFilters.orderBy
      ),
    };
  };

export const getRepartitionPilotageIntentionsUsecase =
  getRepartitionPilotageIntentionsFactory();
