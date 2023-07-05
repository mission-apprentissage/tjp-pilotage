import { inject } from "injecti";

import { queryFormations } from "./dependencies";

export const [getDataForPanorama] = inject(
  { queryFormations },
  (deps) =>
    async ({ codeRegion }: { codeRegion: string }) => {
      const formations = await deps.queryFormations({ codeRegion });

      return {
        formations,
      };
    }
);
