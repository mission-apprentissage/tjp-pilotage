import { inject } from "injecti";

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
    async ({
      codeRegion,
      codesNiveauxDiplomes,
      libellesFilieres,
      orderBy,
    }: {
      codeRegion: string;
      codesNiveauxDiplomes?: string[];
      libellesFilieres?: string[];
      orderBy?: { column: string; order: "asc" | "desc" };
    }) => {
      const formations = await deps.queryFormationsRegion({
        codeRegion,
        codesNiveauxDiplomes,
        libellesFilieres,
        orderBy,
      });
      const { diplomes, filieres } = await deps.getFilters({ codeRegion });

      return {
        formations,
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
    async ({
      codeDepartement,
      codesNiveauxDiplomes,
      libellesFilieres,
      orderBy,
    }: {
      codeDepartement: string;
      codesNiveauxDiplomes?: string[];
      libellesFilieres?: string[];
      orderBy?: { column: string; order: "asc" | "desc" };
    }) => {
      const formations = await deps.queryFormationsDepartement({
        codeDepartement,
        codesNiveauxDiplomes,
        libellesFilieres,
        orderBy,
      });
      const { diplomes, filieres } = await deps.getFilters({ codeDepartement });

      return {
        formations,
        filters: {
          diplomes,
          filieres,
        },
      };
    }
);
