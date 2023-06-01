import { inject } from "injecti";

import { queryFormations, queryStatsForCadran } from "./dependencies";

export const [getRegionStatsForCadran] = inject(
  { queryStatsForCadran, queryFormations },
  (deps) =>
    async ({ codeRegion, UAI }: { codeRegion: string; UAI?: string[] }) => {
      console.log(UAI);
      const stats = await deps.queryStatsForCadran({ codeRegion });
      const formations = await deps.queryFormations({ codeRegion, UAI });

      return {
        stats,
        formations,
      };
    }
);
