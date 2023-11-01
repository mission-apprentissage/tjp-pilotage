import { inject } from "injecti";

import { getFormationsTransformationStatsQuery } from "./getFormationsStatsQuery.dep";
import { getRegionStats } from "./getRegionStats.dep";

export const [getFormationsTransformationStats] = inject(
  { getFormationsTransformationStatsQuery, getRegionStats },
  (deps) =>
    async (filters: {
      status?: "draft" | "submitted";
      type?: "fermeture" | "ouverture";
      rentreeScolaire?: string;
      codeRegion?: string;
      codeAcademie?: string;
      codeDepartement?: string;
      tauxPression?: "eleve" | "faible";
      codeNiveauDiplome?: string[];
      filiere?: string[];
      orderBy?: { column: string; order: "asc" | "desc" };
    }) => {
      const [stats, formations] = await Promise.all([
        deps.getRegionStats({
          ...filters,
          millesimeSortie: "2020_2021",
        }),
        deps.getFormationsTransformationStatsQuery(filters),
      ]);
      return { stats, formations };
    }
);
