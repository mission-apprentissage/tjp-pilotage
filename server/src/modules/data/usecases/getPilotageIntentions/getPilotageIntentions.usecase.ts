import { ScopeEnum } from "shared";
import type {
  getPilotageIntentionsSchema,
} from "shared/routes/schemas/get.pilotage-intentions.schema";
import type { z } from "zod";

import { getCurrentCampagneQuery } from "@/modules/data/queries/getCurrentCampagne/getCurrentCampagne.query";

import type { getDenominateurQuery, getNumerateurQuery} from "./deps";
import { getDomaines, getFiltersQuery, getFormationsQuery, getNiveauxDiplome, getPositionsQuadrant, getStatuts, getZonesGeographiques } from "./deps";
import {getStatsSortieQuery} from './deps/getStatsSortieQuery';
import { formatResult, formatResultUngrouped } from "./utils";

export interface Filters extends z.infer<typeof getPilotageIntentionsSchema.querystring> {
  campagne: string;
}
export interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

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
  | { code: "codeNiveauDiplome"; libelle: "libelleNiveauDiplome" }
  | { code: "statut"; libelle: "statut" };

/**
 * @typedef Repartition - Représente les données de demande et d'effectif aggrégées par un critère donné
 */
export type Repartition = {
  numerateur: Numerateur;
  denominateur: Denominateur;
  groupBy: GroupByCodeLibelle;
};

const getPilotageIntentionsFactory =
  (
    deps = {
      getCurrentCampagneQuery,
      getDomaines,
      getNiveauxDiplome,
      getZonesGeographiques,
      getPositionsQuadrant,
      getStatuts,
      getFiltersQuery,
      getFormationsQuery,
      getStatsSortieQuery
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const campagne = await deps.getCurrentCampagneQuery();
      const anneeCampagne = activeFilters?.campagne ?? campagne.annee;
      const [
        domaines,
        niveauxDiplome,
        zonesGeographiques,
        positionsQuadrant,
        statuts,
        statutsNational,
        formations,
        filters,
        stats
      ] = await Promise.all([
        deps.getDomaines({
          filters: {
            ...activeFilters,
            campagne: anneeCampagne,
          },
        }),
        deps.getNiveauxDiplome({
          filters: {
            ...activeFilters,
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
        deps.getStatuts({
          filters: {
            ...activeFilters,
            campagne: anneeCampagne,
          },
        }),
        deps.getStatuts({
          filters: {
            ...activeFilters,
            scope: ScopeEnum.national,
            codeRegion: undefined,
            codeAcademie: undefined,
            codeDepartement: undefined,
            campagne: anneeCampagne,
          },
        }),
        deps.getFormationsQuery({
          filters: {
            ...activeFilters,
            campagne: anneeCampagne,
          }
        }),
        deps.getFiltersQuery({
          filters :{
            ...activeFilters,
            campagne: anneeCampagne,
          }
        }),
        deps.getStatsSortieQuery({
          filters: {
            ...activeFilters,
            campagne: anneeCampagne,
          }
        })
      ]);

      return {
      // Répartitions non ordonnées
        top10Domaines: formatResult(domaines, "desc", "placesTransformees"),
        niveauxDiplome: formatResult(niveauxDiplome, "desc", "placesTransformees"),
        statuts: formatResultUngrouped(statuts, "desc", "placesTransformees"),
        statutsNational: formatResultUngrouped(statutsNational, "desc", "placesTransformees"),
        // Répartitions ordonnées
        domaines: formatResult(domaines, activeFilters.order, activeFilters.orderBy),
        zonesGeographiques: formatResult(zonesGeographiques, activeFilters.order, activeFilters.orderBy),
        positionsQuadrant: formatResult(positionsQuadrant, activeFilters.order, activeFilters.orderBy),
        formations,
        stats,
        filters,
        campagne,
      };
    };

export const getPilotageIntentionsUsecase = getPilotageIntentionsFactory();
