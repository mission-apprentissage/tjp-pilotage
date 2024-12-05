import { DemandeStatutEnum } from "shared/enum/demandeStatutEnum";
import type { getPilotageIntentionsSchema } from "shared/routes/schemas/get.pilotage-intentions.schema";
import { getMillesimeFromCampagne } from "shared/time/millesimes";
import type { z } from "zod";

import { getCodeRegionFromAcademieQuery } from "@/modules/data/queries/getCodeTerritoire/getCodeRegionFromCodeAcademie.query";
import { getCodeRegionFromDepartementQuery } from "@/modules/data/queries/getCodeTerritoire/getCodeRegionFromCodeDepartement.query";
import { getCurrentCampagneQuery } from "@/modules/data/queries/getCurrentCampagne/getCurrentCampagne.query";
import { getStatsSortieQuery } from "@/modules/data/queries/getStatsSortie/getStatsSortie";

import type { getDenominateurQuery, getNumerateurQuery } from "./dependencies";
import {
  getDomaines,
  getFiltersOptions,
  getFormationsQuery,
  getNiveauxDiplome,
  getPositionsQuadrant,
  getStatsSortie,
  getStatuts,
  getZonesGeographiques,
} from "./dependencies";
import { formatResult, formatResultUngrouped } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
  | { code: "statut"; libelle: "libelleStatut" };

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
      getDomaines,
      getNiveauxDiplome,
      getZonesGeographiques,
      getPositionsQuadrant,
      getStatuts,
      getStatsSortie,
      getFormationsQuery,
      getCodeRegionFromDepartementQuery,
      getCodeRegionFromAcademieQuery,
      getStatsSortieQuery,
      getCurrentCampagneQuery,
      getFiltersOptions,
    }
  ) =>
  async (activeFilters: ActiveFilters) => {
    const campagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters?.campagne ?? campagne.annee;
    const millesimeSortie = getMillesimeFromCampagne(anneeCampagne);
    let codeRegion = activeFilters.codeRegion;

    if (!codeRegion && activeFilters.codeDepartement) {
      const { codeRegion: departementCodeRegion } = await getCodeRegionFromDepartementQuery(
        activeFilters.codeDepartement
      );
      if (departementCodeRegion) {
        codeRegion = departementCodeRegion;
      }
    }

    if (!codeRegion && activeFilters.codeAcademie) {
      const { codeRegion: academieCodeRegion } = await getCodeRegionFromAcademieQuery(activeFilters.codeAcademie);
      if (academieCodeRegion) {
        codeRegion = academieCodeRegion;
      }
    }

    const [
      domaines,
      niveauxDiplome,
      zonesGeographiques,
      validees,
      projets,
      positionsQuadrant,
      statuts,
      formations,
      statsSortie,
      filtersOptions,
    ] = await Promise.all([
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
          codeRegion: undefined,
          codeAcademie: undefined,
          codeDepartement: undefined,
        },
      }),
      deps.getZonesGeographiques({
        filters: {
          ...activeFilters,
          campagne: anneeCampagne,
          statut: [DemandeStatutEnum["demande validée"]],
          codeRegion: undefined,
          codeAcademie: undefined,
          codeDepartement: undefined,
        },
      }),
      deps.getZonesGeographiques({
        filters: {
          ...activeFilters,
          campagne: anneeCampagne,
          statut: [DemandeStatutEnum["projet de demande"]],
          codeRegion: undefined,
          codeAcademie: undefined,
          codeDepartement: undefined,
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
      deps.getFormationsQuery({
        filters: {
          ...activeFilters,
          campagne: anneeCampagne,
          codeRegion,
          millesimeSortie,
        },
      }),
      deps.getStatsSortieQuery({
        ...activeFilters,
        codeRegion,
        millesimeSortie,
      }),
      deps.getFiltersOptions({
        ...activeFilters,
        campagne: anneeCampagne,
      }),
    ]);

    return {
      stats: {},
      repartition: {
        // Répartitions non ordonnées
        top10Domaines: formatResult(domaines, "desc", "placesTransformees"),
        niveauxDiplome: formatResult(niveauxDiplome, "desc", "placesTransformees"),
        // Répartitions ordonnées
        domaines: formatResult(domaines, activeFilters.order, activeFilters.orderBy),
        zonesGeographiques: formatResult(zonesGeographiques, activeFilters.order, activeFilters.orderBy),
        positionsQuadrant: formatResult(positionsQuadrant, activeFilters.order, activeFilters.orderBy),
        statuts: formatResultUngrouped(statuts, activeFilters.order, activeFilters.orderBy),
        [DemandeStatutEnum["demande validée"]]: formatResult(validees, activeFilters.order, activeFilters.orderBy),
        [DemandeStatutEnum["projet de demande"]]: formatResult(projets, activeFilters.order, activeFilters.orderBy),
        all: formatResult(zonesGeographiques, activeFilters.order, activeFilters.orderBy),
      },
      statsSortie,
      formations,
      filtersOptions,
      campagne,
    };
  };

export const getPilotageIntentionsUsecase = getPilotageIntentionsFactory();
