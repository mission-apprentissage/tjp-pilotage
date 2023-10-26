import { inject } from "injecti";

import { getformationsTransformationStatsQuery } from "./getFormationsStatsQuery.dep";
import { getRegionStats } from "./getRegionStats.dep";

export const [getformationsTransformationStats] = inject(
  { getformationsTransformationStatsQuery, getRegionStats },
  (deps) =>
    async (filters: {
      status?: "draft" | "submitted";
      type?: "fermeture" | "ouverture";
      rentreeScolaire?: number;
      codeRegion?: string;
      codeAcademie?: string;
      codeDepartement?: string;
      tauxPression?: "eleve" | "faible";
    }) => {
      const [stats, formations] = await Promise.all([
        deps.getRegionStats({
          ...filters,
          millesimeSortie: "2020_2021",
        }),
        deps.getformationsTransformationStatsQuery(filters),
      ]);
      return { stats, formations };
    }
);
