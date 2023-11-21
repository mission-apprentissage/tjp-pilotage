import { getStatsSortie } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import { dependencies } from "./dependencies";

const getFormationsTransformationStatsFactory =
  (
    deps = {
      getFormationsTransformationStatsQuery:
        dependencies.getFormationsTransformationStatsQuery,
      getRegionStats: dependencies.getRegionStats,
    }
  ) =>
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
    };
export const getFormationsTransformationStats =
  getFormationsTransformationStatsFactory();
