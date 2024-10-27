import { ScopeEnum } from "shared";

import type {
  Filters,
  Repartition,
} from "@/modules/data/usecases/getRepartitionPilotageIntentions/getRepartitionPilotageIntentions.usecase";

import { getDenominateurQuery } from "./getDenominateurQuery";
import { getNumerateurQuery } from "./getNumerateurQuery";

export const getZonesGeographiques = async ({ filters }: { filters: Filters }): Promise<Repartition> => {
  const [numerateur, denominateur] = await Promise.all([
    getNumerateurQuery({
      filters: {
        ...filters,
        codeRegion: undefined,
        codeAcademie: undefined,
        codeDepartement: undefined,
      },
    }),
    getDenominateurQuery({
      filters: {
        ...filters,
        codeRegion: undefined,
        codeAcademie: undefined,
        codeDepartement: undefined,
      },
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
