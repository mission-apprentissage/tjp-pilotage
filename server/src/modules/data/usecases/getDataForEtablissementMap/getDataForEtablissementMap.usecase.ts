import z from "zod";

import * as dependencies from "./dependencies";
import {
  EtablissementProcheSchema,
  getDataForEtablissementMapSchema,
} from "./getDataForEtablissementMap.schema";
import { filterByDistance } from "./services/filterByDistance";
import { formatEtablissement } from "./services/formatEtablissement";

export type EtablissementProche = z.infer<typeof EtablissementProcheSchema>;

export const getDataForEtablissementMapFactory =
  (
    deps = {
      getEtablissement: dependencies.getEtablissement,
      getFormation: dependencies.getFormation,
      getEtablissementsFromCfd: dependencies.getEtablissementsFromCfd,
    }
  ) =>
  async (
    params: z.infer<typeof getDataForEtablissementMapSchema.params>,
    filters: z.infer<typeof getDataForEtablissementMapSchema.querystring>
  ): Promise<
    z.infer<(typeof getDataForEtablissementMapSchema.response)["200"]>
  > => {
    const etablissementsProches: Array<EtablissementProche> = [];
    const etablissement = await deps.getEtablissement({ uai: params.uai });

    if (filters.cfd && filters.cfd.length > 0) {
      const cfds = [...filters.cfd];

      for (let i = 0; i < cfds.length; i++) {
        const etablissements = await deps.getEtablissementsFromCfd({
          cfd: cfds[i],
        });

        const filteredEtablissements = filterByDistance({
          etablissement,
          etablissements,
        }).map(formatEtablissement);

        etablissementsProches.push(...filteredEtablissements);
      }
    }

    return {
      uai: etablissement.UAI,
      latitude: etablissement.latitude || +Infinity,
      longitude: etablissement.longitude || +Infinity,
      etablissementsProches: etablissementsProches,
    };
  };

export const getDataForEtablissementMap = getDataForEtablissementMapFactory();
