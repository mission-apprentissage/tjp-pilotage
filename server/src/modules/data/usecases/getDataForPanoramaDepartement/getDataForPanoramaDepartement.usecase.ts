import { inject } from "injecti";

import { queryFormationsDepartement } from "./dependencies";

export const [getDataForPanoramaDepartement] = inject(
  { queryFormationsDepartement },
  (deps) =>
    async ({ codeDepartement }: { codeDepartement: string }) => {
      const formations = await deps.queryFormationsDepartement({
        codeDepartement,
      });

      return {
        formations,
      };
    }
);
