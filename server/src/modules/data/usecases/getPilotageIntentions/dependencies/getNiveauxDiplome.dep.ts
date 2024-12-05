import type { Filters, Repartition } from "@/modules/data/usecases/getPilotageIntentions/getPilotageIntentions.usecase";

import { getDenominateurQuery } from "./getDenominateur.dep";
import { getNumerateurQuery } from "./getNumerateur.dep";

export const getNiveauxDiplome = async ({ filters }: { filters: Filters }): Promise<Repartition> => {
  const [numerateur, denominateur] = await Promise.all([
    getNumerateurQuery({
      filters,
    }),
    getDenominateurQuery({
      filters,
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
