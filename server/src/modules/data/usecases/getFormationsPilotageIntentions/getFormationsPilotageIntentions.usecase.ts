import type {MILLESIMES_IJ} from 'shared';
import type {FiltersSchema} from 'shared/routes/schemas/get.pilotage-intentions.formations.schema';
import { getMillesimeFromCampagne } from "shared/time/millesimes";
import type {z} from 'zod';

import type {RequestUser} from '@/modules/core/model/User';
import { getStatsSortieQuery } from "@/modules/data/queries/getStatsSortie/getStatsSortie";
import {getCurrentCampagne} from '@/modules/utils/getCurrentCampagne';

import {
  getCodeRegionFromAcademieQuery,
  getCodeRegionFromDepartementQuery,
  getEffectifsParCampagneCodeNiveauDiplomeCodeRegionQuery,
  getFormationsPilotageIntentionsQuery,
  getRegionStatsQuery,
} from "./deps";

export interface Filters extends z.infer<typeof FiltersSchema> {
  user: RequestUser;
  millesimeSortie?: (typeof MILLESIMES_IJ)[number];
  campagne: string;
}
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
      getCurrentCampagne,
    }
  ) =>
    async (activeFilters: ActiveFilters) => {
      const campagne = await deps.getCurrentCampagne(activeFilters.user);
      const anneeCampagne = activeFilters.campagne ?? campagne.annee;
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
export const getFormationsPilotageIntentionsUsecase = getQuadrantPilotageIntentionsFactory();
