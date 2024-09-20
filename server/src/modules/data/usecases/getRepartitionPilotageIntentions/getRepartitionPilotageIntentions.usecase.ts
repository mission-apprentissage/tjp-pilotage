import _ from "lodash";
import { z } from "zod";

import { RequestUser } from "../../../core/model/User";
import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { getDomainesQuery } from "./deps/getDomainesQuery";
import { getNiveauxDiplomeQuery } from "./deps/getNiveauxDiplomeQuery";
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
    tauxTransformationOuvertures: undefined,
    tauxTransformationFermetures: undefined,
    tauxTransformationColorations: undefined,
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
    total.tauxTransformationOuvertures = total.placesOuvertes / total.effectif;
    total.tauxTransformationFermetures = total.placesFermees / total.effectif;
    total.tauxTransformationColorations = total.placesColorees / total.effectif;
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
    }))
    .orderBy((item) => {
      const value = orderBy
        ? item[orderBy as keyof typeof item]
        : item.placesTransformees;

      return value === null || value === undefined ? 0 : value; // Treat null/undefined as 0
    }, order)
    .keyBy("libelle")
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
      top10Domaines: formatResult(domaines),
      niveauxDiplome: formatResult(niveauxDiplome),
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
