import type { Filters, Repartition } from "@/modules/data/usecases/getPilotageIntentions/getPilotageIntentions.usecase";

import { getDenominateurQuery } from "./getDenominateurQuery";
import { getNumerateurQuery } from "./getNumerateurQuery";

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
