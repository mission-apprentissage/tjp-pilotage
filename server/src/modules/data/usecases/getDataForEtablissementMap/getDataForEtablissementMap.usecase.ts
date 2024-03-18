import z from "zod";

import * as dependencies from "./dependencies";
import {
  EtablissementProcheSchema,
  getDataForEtablissementMapSchema,
} from "./getDataForEtablissementMap.schema";
import { formatEtablissement } from "./services/formatEtablissement";
import { getDistance } from "./services/getDistance";

export type EtablissementProche = z.infer<typeof EtablissementProcheSchema>;
export type RouteQueryString = z.infer<
  typeof getDataForEtablissementMapSchema.querystring
>;

export const getDataForEtablissementMapFactory =
  (
    deps = {
      getEtablissement: dependencies.getEtablissement,
      getEtablissementCfds: dependencies.getEtablissementCfds,
      getEtablissementsProches: dependencies.getEtablissementsProches,
    }
  ) =>
  async (
    params: z.infer<typeof getDataForEtablissementMapSchema.params>,
    filters: RouteQueryString
  ): Promise<
    z.infer<(typeof getDataForEtablissementMapSchema.response)["200"]>
  > => {
    const etablissementsProches: Array<EtablissementProche> = [];
    const etablissement = await deps.getEtablissement({ uai: params.uai });

    const cfds =
      filters?.cfd && filters.cfd.length > 0
        ? filters.cfd
        : (await deps.getEtablissementCfds({ uai: params.uai })).map(
            (r) => r.cfd
          );

    const etablissements = await deps.getEtablissementsProches({
      cfd: cfds,
      bbox: filters.bbox,
      uai: params.uai,
    });

    const filteredEtablissements = getDistance({
      etablissement,
      etablissements,
    }).map(formatEtablissement);

    etablissementsProches.push(...filteredEtablissements);

    return {
      uai: etablissement.UAI,
      latitude: etablissement.latitude || +Infinity,
      longitude: etablissement.longitude || +Infinity,
      etablissementsProches: etablissementsProches,
    };
  };

export const getDataForEtablissementMap = getDataForEtablissementMapFactory();
