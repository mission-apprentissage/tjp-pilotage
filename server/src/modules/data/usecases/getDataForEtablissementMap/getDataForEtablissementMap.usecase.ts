import z from "zod";

import * as dependencies from "./dependencies";
import { getDataForEtablissementMapSchema } from "./getDataForEtablissementMap.schema";
import { formatEtablissement } from "./services/formatEtablissement";
import { getDistance } from "./services/getDistance";
import { getInitialZoom } from "./services/getInitialZoom";

export type Etablissement = Awaited<
  ReturnType<typeof dependencies.getEtablissementsProches>
>[number];

export interface EtablissementWithDistance extends Etablissement {
  distance: number;
}
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

    const formattedEtablissement = formatEtablissement({
      ...etablissement,
      distance: 0,
    });

    const initialZoom = getInitialZoom(
      formattedEtablissement,
      filteredEtablissements
    );

    return {
      ...formattedEtablissement,
      etablissementsProches: filteredEtablissements,
      initialZoom,
    };
  };

export const getDataForEtablissementMap = getDataForEtablissementMapFactory();
