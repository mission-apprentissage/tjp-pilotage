import type {MILLESIMES_IJ} from 'shared';
import type {FiltersSchema} from 'shared/routes/schemas/get.pilotage.formations.schema';
import type {z} from 'zod';

import type {RequestUser} from '@/modules/core/model/User';
import {getCurrentCampagne} from '@/modules/utils/getCurrentCampagne';

import {
  getCodeRegionFromAcademieQuery,
  getCodeRegionFromDepartementQuery,
  getFormationsQuery,
  getStatsSortieQuery
} from "./deps";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
  campagne: string;
}
interface ActiveFilters extends Omit<Filters, "campagne"> {
  campagne?: string;
}

const getFormationsPilotageFactory =
  (
    deps = {
      getFormationsQuery,
      getCodeRegionFromDepartementQuery,
      getCodeRegionFromAcademieQuery,
      getStatsSortieQuery,
      getCurrentCampagne,
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const campagne = await deps.getCurrentCampagne(activeFilters.user);
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
export const getFormationsPilotageUsecase = getFormationsPilotageFactory();
