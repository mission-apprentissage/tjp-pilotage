import type { Filters, Repartition } from "@/modules/data/usecases/getPilotageIntentions/getPilotageIntentions.usecase";

import { getDenominateurQuery } from "./getDenominateurQuery";
import { getNumerateurQuery } from "./getNumerateurQuery";

export const getDomaines = async ({ filters }: { filters: Filters }): Promise<Repartition> => {
  const [numerateur, denominateur] = await Promise.all([
    getNumerateurQuery({
      filters: {
        ...filters,
        codeNsf: undefined,
      },
    }),
    getDenominateurQuery({
      filters: {
        ...filters,
        codeNsf: undefined,
      },
    }),
  ]);

  return {
    numerateur,
    denominateur,
    groupBy: {
      code: "codeNsf",
      libelle: "libelleNsf",
    },
  };
};
