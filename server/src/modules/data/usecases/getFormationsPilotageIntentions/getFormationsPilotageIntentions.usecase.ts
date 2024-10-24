import { getMillesimeFromCampagne } from "shared/time/millesimes";

import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { getStatsSortieQuery } from "../../queries/getStatsSortie/getStatsSortie";
import {
  getCodeRegionFromAcademieQuery,
  getCodeRegionFromDepartementQuery,
  getEffectifsParCampagneCodeNiveauDiplomeCodeRegionQuery,
  getFormationsPilotageIntentionsQuery,
  getRegionStatsQuery,
} from "./deps";
import { Filters } from "./deps/getFormationsPilotageIntentions.dep";

interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

const getQuadrantPilotageIntentionsFactory =
  (
    deps = {
      getEffectifsParCampagneCodeNiveauDiplomeCodeRegionQuery,
      getRegionStatsQuery,
      getFormationsPilotageIntentionsQuery,
      getCodeRegionFromDepartementQuery,
      getCodeRegionFromAcademieQuery,
      getStatsSortieQuery,
      getCurrentCampagneQuery,
    }
  ) =>
  async (activeFilters: ActiveFilters) => {
    const campagne = await deps.getCurrentCampagneQuery();
    const anneeCampagne = activeFilters.campagne ?? campagne.annee;
    let codeRegion = activeFilters.codeRegion;

    if (!codeRegion && activeFilters.codeDepartement) {
      const { codeRegion: departementCodeRegion } =
        await getCodeRegionFromDepartementQuery(activeFilters.codeDepartement);
      if (departementCodeRegion) {
        codeRegion = departementCodeRegion;
      }
    }

    if (!codeRegion && activeFilters.codeAcademie) {
      const { codeRegion: academieCodeRegion } =
        await getCodeRegionFromAcademieQuery(activeFilters.codeAcademie);
      if (academieCodeRegion) {
        codeRegion = academieCodeRegion;
      }
    }

    const [formations, statsSortie] = await Promise.all([
      deps.getFormationsPilotageIntentionsQuery({
        ...activeFilters,
        campagne: anneeCampagne,
        codeRegion,
      }),
      getStatsSortieQuery({
        ...activeFilters,
        codeRegion,
        millesimeSortie: getMillesimeFromCampagne(anneeCampagne),
      }),
    ]);

    return {
      stats: statsSortie,
      formations: formations.map((formation) => ({
        ...formation,
      })),
    };
  };
export const getFormationsPilotageIntentionsUsecase =
  getQuadrantPilotageIntentionsFactory();
