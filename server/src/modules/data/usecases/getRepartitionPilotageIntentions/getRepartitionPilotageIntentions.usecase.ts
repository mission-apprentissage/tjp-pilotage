import _ from "lodash";
import { z } from "zod";

import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { getDenominateurQuery } from "./deps/getDenominateurQuery";
import { getDomaines } from "./deps/getDomaines";
import { getNiveauxDiplome } from "./deps/getNiveauxDiplome";
import { getNumerateurQuery } from "./deps/getNumerateurQuery";
import { getPositionsQuadrant } from "./deps/getPositionsQuadrant";
import { getZonesGeographiques } from "./deps/getZonesGeographiques";
import {
  getRepartitionPilotageIntentionsSchema,
  StatsSchema,
} from "./getRepartitionPilotageIntentions.schema";

export interface Filters
  extends z.infer<typeof getRepartitionPilotageIntentionsSchema.querystring> {}

/**
 * @typedef Numerateur - Représente les données de demande (places ouvertes, fermées, colorées, transformées)
 */
type Numerateur = Awaited<ReturnType<typeof getNumerateurQuery>>;

/**
 * @typedef Denominateur - Représente les données d'effectif
 */
type Denominateur = Awaited<ReturnType<typeof getDenominateurQuery>>;

/**
 * @typedef GroupByCodeLibelle - Représente les critères de regroupement possibles
 */
type GroupByCodeLibelle =
  | { code: "codeRegion"; libelle: "libelleRegion" }
  | { code: "codeAcademie"; libelle: "libelleAcademie" }
  | { code: "codeDepartement"; libelle: "libelleDepartement" }
  | { code: "positionQuadrant"; libelle: "positionQuadrant" }
  | { code: "codeNsf"; libelle: "libelleNsf" }
  | { code: "codeNiveauDiplome"; libelle: "libelleNiveauDiplome" };

/**
 * @typedef Repartition - Représente les données de demande et d'effectif aggrégées par un critère donné
 */
export type Repartition = {
  numerateur: Numerateur;
  denominateur: Denominateur;
  groupBy: GroupByCodeLibelle;
};

/**
 *
 * @param {}
 * @returns
 */
const groupByResult = ({ numerateur, denominateur, groupBy }: Repartition) => {
  // Récupérer tous les codes possibles (y compris ceux qui n'ont pas d'effectif ou de demande)
  const allKeys = _.union(
    _.keys(_(numerateur).groupBy(groupBy.code).value()),
    _.keys(_(denominateur).groupBy(groupBy.code).value())
  );

  return _(allKeys)
    .map((code) => {
      // Chercher les effectifs associées
      const effectifGrouped = _.filter(denominateur, {
        [groupBy.code]: code,
      });
      // Chercher les demandes associées
      const demandeGrouped = _.filter(numerateur, {
        [groupBy.code]: code,
      });

      // Somme des effectifs
      const totalEffectifs = _.sumBy(effectifGrouped, "effectif");

      // Somme des places
      const sommePlacesOuvertes = _.sumBy(demandeGrouped, "placesOuvertes");
      const sommePlacesFermees = _.sumBy(demandeGrouped, "placesFermees");
      const sommePlacesNonColoreesTransformees = _.sumBy(
        demandeGrouped,
        "placesNonColoreesTransformees"
      );
      const sommePlacesColorees = _.sumBy(demandeGrouped, "placesColorees");
      const sommePlacesColoreesOuvertes = _.sumBy(
        demandeGrouped,
        "placesColoreesOuvertes"
      );
      const sommePlacesColoreesFermees = _.sumBy(
        demandeGrouped,
        "placesColoreesFermees"
      );
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
        placesNonColoreesTransformees: sommePlacesNonColoreesTransformees,
        placesColoreesOuvertes: sommePlacesColoreesOuvertes,
        placesColoreesFermees: sommePlacesColoreesFermees,
        placesColorees: sommePlacesColorees,
        placesTransformees: sommePlacesTransformees,
        solde: sommeSolde,
      };
    })
    .value();
};

/**
 *
 * Fonction qui permet de calculer la somme des données aggrégées données de demande et d'effectif
 *
 * @param statsRepartition
 * @returns
 */
const calculateTotal = (
  statsRepartition: z.infer<typeof StatsSchema>[]
): z.infer<typeof StatsSchema>[] => {
  const total: z.infer<typeof StatsSchema> = {
    libelle: "Total",
    code: "total",
    effectif: 0,
    placesOuvertes: 0,
    placesFermees: 0,
    placesNonColoreesTransformees: 0,
    placesColoreesOuvertes: 0,
    placesColoreesFermees: 0,
    placesColorees: 0,
    placesTransformees: 0,
    solde: 0,
    tauxTransformation: undefined,
    ratioOuverture: undefined,
    ratioFermeture: undefined,
  };

  Object.values(statsRepartition).forEach((stats) => {
    total.effectif += stats.effectif;
    total.placesOuvertes += stats.placesOuvertes;
    total.placesFermees += stats.placesFermees;
    total.placesNonColoreesTransformees += stats.placesNonColoreesTransformees;
    total.placesColoreesOuvertes += stats.placesColoreesOuvertes;
    total.placesColoreesFermees += stats.placesColoreesFermees;
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

  return [...statsRepartition, total];
};

const formatResult = (
  repartition: Repartition,
  order: "asc" | "desc" = "desc",
  orderBy?: string
) => {
  return _.chain(calculateTotal(groupByResult(repartition)))
    .map((item) => ({
      ...item,
      libelle: item.libelle ?? item.code,
      ratioFermeture:
        item.placesFermees && item.placesOuvertes
          ? item.placesFermees / (item.placesFermees + item.placesOuvertes)
          : undefined,
      ratioOuverture:
        item.placesFermees && item.placesOuvertes
          ? item.placesOuvertes / (item.placesFermees + item.placesOuvertes)
          : undefined,
      tauxTransformation: item.effectif
        ? item.placesTransformees / item.effectif
        : undefined,
    }))
    .orderBy((item) => {
      const value = orderBy ? item[orderBy as keyof typeof item] : item.libelle;

      return !value ? 0 : value; // Treat null/undefined as 0
    }, order)
    .keyBy("libelle")
    .value();
};

const getRepartitionPilotageIntentionsFactory =
  (
    deps = {
      getCurrentCampagneQuery,
      getDomaines,
      getNiveauxDiplome,
      getZonesGeographiques,
      getPositionsQuadrant,
    }
  ) =>
  async (activeFilters: Filters) => {
    const campagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters?.campagne ?? campagne.annee;
    const [domaines, niveauxDiplome, zonesGeographiques, positionsQuadrant] =
      await Promise.all([
        deps.getDomaines({
          filters: {
            ...activeFilters,
            codeNsf: undefined,
            campagne: anneeCampagne,
          },
        }),
        deps.getNiveauxDiplome({
          filters: {
            ...activeFilters,
            codeNiveauDiplome: undefined,
            campagne: anneeCampagne,
          },
        }),
        deps.getZonesGeographiques({
          filters: {
            ...activeFilters,
            campagne: anneeCampagne,
          },
        }),
        deps.getPositionsQuadrant({
          filters: {
            ...activeFilters,
            campagne: anneeCampagne,
          },
        }),
      ]);

    return {
      // Répartitions non ordonnées
      top10Domaines: formatResult(domaines, "desc", "placesTransformees"),
      niveauxDiplome: formatResult(
        niveauxDiplome,
        "desc",
        "placesTransformees"
      ),
      // Répartitions ordonnées
      domaines: formatResult(
        domaines,
        activeFilters.order,
        activeFilters.orderBy
      ),
      zonesGeographiques: formatResult(
        zonesGeographiques,
        activeFilters.order,
        activeFilters.orderBy
      ),
      positionsQuadrant: formatResult(
        positionsQuadrant,
        activeFilters.order,
        activeFilters.orderBy
      ),
    };
  };

export const getRepartitionPilotageIntentionsUsecase =
  getRepartitionPilotageIntentionsFactory();
