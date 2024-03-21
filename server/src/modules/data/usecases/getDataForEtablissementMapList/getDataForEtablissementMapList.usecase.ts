import Boom from "@hapi/boom";
import z from "zod";

import * as dependencies from "./dependencies";
import { getDataForEtablissementMapListSchema } from "./getDataForEtablissementMapList.schema";
import { formatEtablissement } from "./services/formatEtablissement";
import { getDistance } from "./services/getDistance";

export type Etablissement = Awaited<
  ReturnType<typeof dependencies.getEtablissementsProches>
>[number];

export interface EtablissementWithDistance extends Etablissement {
  distance: number;
}
export type RouteQueryString = z.infer<
  typeof getDataForEtablissementMapListSchema.querystring
>;

export const getDataForEtablissementMapListFactory =
  (
    deps = {
      getEtablissement: dependencies.getEtablissement,
      getEtablissementCfds: dependencies.getEtablissementCfds,
      getEtablissementsProches: dependencies.getEtablissementsProches,
    }
  ) =>
  async (
    params: z.infer<typeof getDataForEtablissementMapListSchema.params>,
    filters: RouteQueryString
  ): Promise<
    z.infer<(typeof getDataForEtablissementMapListSchema.response)["200"]>
  > => {
    const etablissement = await deps.getEtablissement({ uai: params.uai });

    if (!etablissement.latitude || !etablissement.longitude) {
      throw Boom.badData("L'etablissement n'a pas de coordonnées GPS");
    }

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
      etablissements: etablissements,
    }).map(formatEtablissement);

    return {
      etablissements: filteredEtablissements,
    };
  };

export const getDataForEtablissementMapList =
  getDataForEtablissementMapListFactory();
