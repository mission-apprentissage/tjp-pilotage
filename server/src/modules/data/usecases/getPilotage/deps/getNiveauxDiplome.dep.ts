import type { Filters, Repartition } from "@/modules/data/usecases/getPilotage/getPilotage.usecase";

import { getDenominateurQuery } from "./getDenominateurQuery.dep";
import { getNumerateurQuery } from "./getNumerateurQuery.dep";

export const getNiveauxDiplome = async ({ filters }: { filters: Filters }): Promise<Repartition> => {
  const [numerateur, denominateur] = await Promise.all([
    getNumerateurQuery({
      filters: {
        ...filters,
        codeNiveauDiplome: undefined,
      },
    }),
    getDenominateurQuery({
      filters: {
        ...filters,
        codeNiveauDiplome: undefined,
      },
    }),
  ]);

  return {
    numerateur,
    denominateur,
    groupBy: {
      code: "codeNiveauDiplome",
      libelle: "libelleNiveauDiplome",
    },
  };
};
