import * as Boom from "@hapi/boom";
import type { getDataForEtablissementMapListSchema } from "shared/routes/schemas/get.etablissement.uai.map.list.schema";
import type { z } from "zod";

import * as dependencies from "./dependencies";
import { getCountEtablissementsProches } from "./dependencies/getCountEtablissementsProches";
import { formatEtablissement } from "./services/formatEtablissement";
import { getDistance } from "./services/getDistance";

export type Etablissement = Awaited<ReturnType<typeof dependencies.getEtablissementsProches>>[number];

export interface EtablissementWithDistance extends Etablissement {
  distance: number;
}
export type RouteQueryString = z.infer<typeof getDataForEtablissementMapListSchema.querystring>;

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
    ): Promise<z.infer<(typeof getDataForEtablissementMapListSchema.response)["200"]>> => {
    // Nécessaire ici de récupérer l'établissement sans filtrer par
    // CFD, parce qu'il est possible que l'établissement
    // ne dispense pas la formation sur laquelle la carte est filtrée.
      const etablissementData = await deps.getEtablissement({
        uai: params.uai,
      });

      if (!etablissementData) {
        throw Boom.notFound("Établissement non trouvé en base");
      }

      const etablissement = await deps.getEtablissement({
        uai: params.uai,
        cfd: filters?.cfd,
      });

      const foundEtablissement = etablissement
        ? etablissement
        : // Si l'établissement a été trouvé sans filtre par CFD, cela signifie que la
        // formation (cfd) n'est pas enseignée dans celui-ci. Il faut donc remettre à
        // 0 les voies et les libellés dispositifs où il est enseigné.
        { ...etablissementData, voies: [], libellesDispositifs: [] };

      const formattedEtablissement = formatEtablissement({
        ...foundEtablissement,
        distance: 0,
      });

      const cfds =
      filters?.cfd && filters.cfd.length > 0
        ? filters.cfd
        : (await deps.getEtablissementCfds({ uai: params.uai })).map((r) => r.cfd);

      const etablissements = await deps.getEtablissementsProches({
        cfd: cfds,
        bbox: filters.bbox,
      });

      const filteredEtablissements = getDistance({
        etablissement: foundEtablissement,
        etablissements: etablissements,
      }).map(formatEtablissement);

      const count = await getCountEtablissementsProches({
        cfd: cfds,
        bbox: filters.bbox,
      });

      return {
        count: count[0]?.count ?? 0,
        etablissement: etablissement ? formattedEtablissement : undefined,
        etablissementsProches: filteredEtablissements,
      };
    };

export const getDataForEtablissementMapList = getDataForEtablissementMapListFactory();
