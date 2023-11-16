import { inject } from "injecti";

import { getStatsSortie } from "../../queries/getStatsSortie/getStatsSortie";
import { getPositionQuadrant } from "../../services/getPositionQuadrant";
import {
  getFilters,
  queryFormationsDepartement,
  queryFormationsRegion,
} from "./dependencies";

export const [getDataForPanoramaRegion] = inject(
  {
    queryFormationsRegion,
    getFilters,
  },
  (deps) =>
    async (activeFilters: {
      codeRegion: string;
      codeNiveauDiplome?: string[];
      libelleFiliere?: string[];
      orderBy?: { column: string; order: "asc" | "desc" };
    }) => {
      const [formations, { diplomes, filieres }, statsSortie] =
        await Promise.all([
          deps.queryFormationsRegion(activeFilters),
          deps.getFilters(activeFilters),
          getStatsSortie(activeFilters),
        ]);

      return {
        formations: formations.map((formation) => ({
          ...formation,
          positionQuadrant: getPositionQuadrant(formation, statsSortie),
        })),
        filters: {
          diplomes,
          filieres,
        },
      };
    }
);

export const [getDataForPanoramaDepartement] = inject(
  {
    queryFormationsDepartement,
    getFilters,
  },
  (deps) =>
    async (activeFilters: {
      codeDepartement: string;
      codeNiveauDiplome?: string[];
      libelleFiliere?: string[];
      orderBy?: { column: string; order: "asc" | "desc" };
    }) => {
      const [formations, { diplomes, filieres }, statsSortie] =
        await Promise.all([
          deps.queryFormationsDepartement(activeFilters),
          deps.getFilters(activeFilters),
          getStatsSortie(activeFilters),
        ]);

      return {
        formations: formations.map((formation) => ({
          ...formation,
          positionQuadrant: getPositionQuadrant(formation, statsSortie),
        })),
        filters: {
          diplomes,
          filieres,
        },
      };
    }
);
