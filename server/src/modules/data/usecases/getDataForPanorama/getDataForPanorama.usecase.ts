import { inject } from "injecti";

import { queryFormationsDepartement, queryFormationsRegion } from "./dependencies"


export const [getDataForPanoramaRegion] = inject(
  { queryFormationsRegion },
  (deps) =>
    async ({ codeRegion }: { codeRegion: string; }) => {
      const formations = await deps.queryFormationsRegion({ codeRegion });

      return {
        formations,
      };
    }
);

export const [getDataForPanoramaDepartement] = inject(
  { queryFormationsDepartement },
  (deps) =>
    async ({ codeDepartement }: { codeDepartement: string }) => {
      const formations = await deps.queryFormationsDepartement({ codeDepartement });

      return {
        formations,
      };
    }
);
