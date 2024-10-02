import { MILLESIMES_IJ } from "shared";
import { z } from "zod";

import { getCurrentCampagneQuery } from "../../queries/getCurrentCampagne/getCurrentCampagne.query";
import { getStatsSortieQuery } from "../../queries/getStatsSortie/getStatsSortie";
import {
  getCodeRegionFromAcademieQuery,
  getCodeRegionFromDepartementQuery,
  getEffectifsParCampagneCodeNiveauDiplomeCodeRegionQuery,
  getFormationsPilotageIntentionsQuery,
  getRegionStatsQuery,
} from "./deps";
import { getFormationsPilotageIntentionsSchema } from "./getFormationsPilotageIntentions.schema";

export interface Filters
  extends z.infer<typeof getFormationsPilotageIntentionsSchema.querystring> {
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
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
  async (activeFilters: Filters) => {
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
        campagne: anneeCampagne,
        ...activeFilters,
        codeRegion,
      }),
      getStatsSortieQuery({ ...activeFilters, codeRegion }),
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
