import { inject } from "injecti";

import { getStatsSortie } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { getFormationsTransformationStatsQuery } from "./getFormationsStatsQuery.dep";
import { getRegionStats } from "./getRegionStats.dep";

export const [getFormationsTransformationStats] = inject(
  { getFormationsTransformationStatsQuery, getRegionStats },
  (deps) =>
    async (activeFilters: {
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
      positionQuadrant?: string;
    }) => {
      const [formations, statsSortie] = await Promise.all([
        deps.getFormationsTransformationStatsQuery(activeFilters),
        getStatsSortie(activeFilters),
      ]);

      return {
        stats: statsSortie,
        formations: formations.map((formation) => ({
          ...formation,
          positionQuadrant: getPositionQuadrant(formation, statsSortie),
        })),
      };
    }
);
