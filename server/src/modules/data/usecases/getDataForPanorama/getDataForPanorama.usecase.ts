import { inject } from "injecti";

import {
  queryFormationsDepartement,
  queryFormationsRegion,
} from "./dependencies";

export const [getDataForPanoramaRegion] = inject(
  { queryFormationsRegion },
  (deps) =>
    async (
      {
        codeRegion,
        orderBy
      }: {
        codeRegion: string;
        orderBy?: { column: string; order: "asc" | "desc" };
      }) => {
      console.log("codeRegion", codeRegion)
      console.log("orderBy", orderBy)
      const formations = await deps.queryFormationsRegion({ codeRegion, orderBy });

      return {
        formations,
      };
    }
);

export const [getDataForPanoramaDepartement] = inject(
  { queryFormationsDepartement },
  (deps) =>
    async (
      {
        codeDepartement,
        orderBy
      }: {
        codeDepartement: string;
        orderBy?: { column: string; order: "asc" | "desc" };
      }) => {
      const formations = await deps.queryFormationsDepartement({
        codeDepartement,
        orderBy
      });

      return {
        formations,
      };
    }
);
