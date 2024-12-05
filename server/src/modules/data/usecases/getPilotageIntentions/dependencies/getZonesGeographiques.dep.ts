import { ScopeEnum } from "shared";

import type { Filters, Repartition } from "@/modules/data/usecases/getPilotageIntentions/getPilotageIntentions.usecase";

import { getDenominateurQuery } from "./getDenominateur.dep";
import { getNumerateurQuery } from "./getNumerateur.dep";

export const getZonesGeographiques = async ({ filters }: { filters: Filters }): Promise<Repartition> => {
  const [numerateur, denominateur] = await Promise.all([
    getNumerateurQuery({
      filters,
    }),
    getDenominateurQuery({
      filters,
    }),
  ]);

  switch (filters.scope) {
    case ScopeEnum["département"]:
      return {
        numerateur,
        denominateur,
        groupBy: {
          code: "codeDepartement",
          libelle: "libelleDepartement",
        },
      };
    case ScopeEnum["académie"]:
      return {
        numerateur,
        denominateur,
        groupBy: {
          code: "codeAcademie",
          libelle: "libelleAcademie",
        },
      };
    case ScopeEnum["région"]:
    default:
      return {
        numerateur,
        denominateur,
        groupBy: {
          code: "codeRegion",
          libelle: "libelleRegion",
        },
      };
  }
};
