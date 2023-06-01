import { inject } from "injecti";
import _ from "lodash";

import { queryFormations, queryStatsForCadran } from "./dependencies";

export const [getRegionStatsForCadran] = inject(
  { queryStatsForCadran, queryFormations },
  (deps) =>
    async ({ codeRegion }: { codeRegion: string }) => {
      const stats = await deps.queryStatsForCadran({ codeRegion });
      const formations = await deps.queryFormations({ codeRegion });

      const medianePoursuite = _.chain(formations)
        .map(({ tauxPoursuiteEtudes }) => tauxPoursuiteEtudes)
        .filter(_.isString)
        .map(_.toInteger)
        .mean()
        .value();

      const medianeInsertion = _.chain(formations)
        .map(({ tauxInsertion12mois }) => tauxInsertion12mois)
        .filter(_.isString)
        .map(_.toInteger)
        .mean()
        .value();

      return {
        stats: { ...stats, medianePoursuite, medianeInsertion },
        formations,
      };
    }
);
