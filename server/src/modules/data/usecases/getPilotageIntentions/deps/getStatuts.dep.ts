

import type { Filters, Repartition } from "@/modules/data/usecases/getPilotageIntentions/getPilotageIntentions.usecase";

import { getDenominateurQuery } from "./getDenominateurQuery.dep";
import { getNumerateurQuery } from "./getNumerateurQuery.dep";

export const getStatuts = async ({ filters }: { filters: Filters }): Promise<Repartition> => {
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
      code: "statut",
      libelle: "statut",
    },
  };
};
