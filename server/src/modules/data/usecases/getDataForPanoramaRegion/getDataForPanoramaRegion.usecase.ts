import { inject } from "injecti";

import { queryFormationsRegion } from "./dependencies";

export const [getDataForPanoramaRegion] = inject(
  { queryFormationsRegion },
  (deps) =>
    async ({ codeRegion }: { codeRegion: string }) => {
      const formations = await deps.queryFormationsRegion({ codeRegion });

      return {
        formations,
      };
    }
);
