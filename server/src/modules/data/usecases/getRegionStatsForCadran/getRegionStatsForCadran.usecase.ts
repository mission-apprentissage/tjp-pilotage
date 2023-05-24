import { inject } from "injecti";

import { queryStatsForCadran } from "./dependencies";

export const [getRegionStatsForCadran] = inject(
  { queryStatsForCadran },
  (deps) =>
    async ({ codeRegion }: { codeRegion: string }) => {
      const stats = await deps.queryStatsForCadran({ codeRegion });
      return {
        ...stats,
        nbFormationsFavorables: 0,
        nbFormationsDefavorables: 0,
      };
    }
);
