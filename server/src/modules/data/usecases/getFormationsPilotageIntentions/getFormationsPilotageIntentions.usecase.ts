import type { getFormationsPilotageIntentionsSchema } from 'shared/routes/schemas/get.pilotage-intentions.formations.schema';
import type {z} from 'zod';

import { getCurrentCampagneQuery } from "@/modules/data/queries/getCurrentCampagne/getCurrentCampagne.query";

import {
  getCodeRegionFromAcademieQuery,
  getCodeRegionFromDepartementQuery,
  getFormationsQuery,
  getStatsSortieQuery
} from "./deps";

export interface Filters extends z.infer<typeof getFormationsPilotageIntentionsSchema.querystring> {
  campagne: string;
}
export interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

const getQuadrantPilotageIntentionsFactory =
  (
    deps = {
      getFormationsQuery,
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
        const {
          codeRegion: departementCodeRegion
        } = await deps.getCodeRegionFromDepartementQuery(
          activeFilters.codeDepartement
        );
        if (departementCodeRegion) {
          codeRegion = departementCodeRegion;
        }
      }

      if (!codeRegion && activeFilters.codeAcademie) {
        const {
          codeRegion: academieCodeRegion
        } = await deps.getCodeRegionFromAcademieQuery(activeFilters.codeAcademie);
        if (academieCodeRegion) {
          codeRegion = academieCodeRegion;
        }
      }

      const [formations, stats] = await Promise.all([
        deps.getFormationsQuery({
          filters : {
            ...activeFilters,
            campagne: anneeCampagne,
            codeRegion,
          }
        }),
        deps.getStatsSortieQuery({
          filters :{
            ...activeFilters,
            campagne: anneeCampagne,
            codeRegion,
          }
        }),
      ]);

      return {
        stats,
        formations,
      };
    };
export const getFormationsPilotageIntentionsUsecase = getQuadrantPilotageIntentionsFactory();
