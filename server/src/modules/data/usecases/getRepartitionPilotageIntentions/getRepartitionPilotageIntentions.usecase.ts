import _ from "lodash";
import { DemandeStatutType } from "shared/enum/demandeStatutEnum";
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
  statut?: Exclude<DemandeStatutType, "supprimée" | "refusée">;
  user: RequestUser;
}

const calculateTotal = (
  statsRepartition: z.infer<typeof StatsSchema>[]
): z.infer<typeof StatsSchema>[] => {
  const total = {
    libelle: "Total",
    code: "total",
    placesEffectivementOccupees: 0,
    placesOuvertes: 0,
    placesFermees: 0,
    placesColorees: 0,
    placesTransformees: 0,
    solde: 0,
    tauxTransformation: 0,
    tauxTransformationOuvertures: 0,
    tauxTransformationFermetures: 0,
    tauxTransformationColorations: 0,
    ratioOuverture: 0,
    ratioFermeture: 0,
  };

  // Iterate through each entry and sum up the values
  Object.values(statsRepartition).forEach((stats) => {
    total.placesEffectivementOccupees += stats.placesEffectivementOccupees;
    total.placesOuvertes += stats.placesOuvertes;
    total.placesFermees += stats.placesFermees;
    total.placesColorees += stats.placesColorees;
    total.placesTransformees += stats.placesTransformees;
    total.solde += stats.solde;
  });

  total.tauxTransformation =
    total.placesTransformees / total.placesEffectivementOccupees;
  total.tauxTransformationOuvertures =
    total.placesOuvertes / total.placesEffectivementOccupees;
  total.tauxTransformationFermetures =
    total.placesFermees / total.placesEffectivementOccupees;
  total.tauxTransformationColorations =
    total.placesColorees / total.placesEffectivementOccupees;

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
      ratioFermeture: (item.placesFermees || 0) / item.placesTransformees,
      ratioOuverture: (item.placesOuvertes || 0) / item.placesTransformees,
    }))
    .orderBy((item) => {
      if (orderBy) return item[orderBy as keyof typeof item];
      return item.placesTransformees;
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
            campagne: anneeCampagne,
          },
        }),
        deps.getNiveauxDiplomeQuery({
          filters: {
            ...activeFilters,
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
