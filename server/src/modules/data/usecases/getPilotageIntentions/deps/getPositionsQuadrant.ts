import type { Filters, Repartition } from "@/modules/data/usecases/getPilotageIntentions/getPilotageIntentions.usecase";

import { getDenominateurQuery } from "./getDenominateurQuery";
import { getNumerateurQuery } from "./getNumerateurQuery";

export const getPositionsQuadrant = async ({ filters }: { filters: Filters }): Promise<Repartition> => {
  const [numerateur, denominateur] = await Promise.all([
    getNumerateurQuery({
      filters: {
        ...filters,
      },
    }),
    getDenominateurQuery({
      filters: {
        ...filters,
      },
    }),
  ]);

  return {
    numerateur,
    denominateur,
    groupBy: {
      code: "positionQuadrant",
      libelle: "positionQuadrant",
    },
  };
};
