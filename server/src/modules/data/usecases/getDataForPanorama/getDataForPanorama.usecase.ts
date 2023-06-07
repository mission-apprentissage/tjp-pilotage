import { inject } from "injecti";

import { queryFormations, queryStatsForCadran } from "./dependencies";

export const [getDataForPanorama] = inject(
  { queryStatsForCadran, queryFormations },
  (deps) =>
    async ({ codeRegion, UAI }: { codeRegion: string; UAI?: string[] }) => {
      const stats = await deps.queryStatsForCadran({ codeRegion });
      if (!stats) return { stats: {}, formations: [] };
      const formations = await deps.queryFormations({ codeRegion, UAI });

      return {
        stats,
        formations,
      };
    }
);
