import Boom from "@hapi/boom";
import type { getDataForEtablissementMapSchema } from "shared/routes/schemas/get.etablissement.uai.map.schema";
import type { z } from "zod";

import * as dependencies from "./dependencies";
import { formatEtablissement } from "./services/formatEtablissement";
import { getDistance } from "./services/getDistance";
import { getInitialZoom } from "./services/getInitialZoom";

export type Etablissement = Awaited<ReturnType<typeof dependencies.getEtablissementsProches>>[number];

export interface EtablissementWithDistance extends Etablissement {
  distance: number;
}
export type RouteQueryString = z.infer<typeof getDataForEtablissementMapSchema.querystring>;

export const getDataForEtablissementMapFactory =
  (
    deps = {
      getEtablissement: dependencies.getEtablissement,
      getEtablissementCfds: dependencies.getEtablissementCfds,
      getEtablissementsProches: dependencies.getEtablissementsProches,
    },
  ) =>
  async (
    params: z.infer<typeof getDataForEtablissementMapSchema.params>,
    filters: RouteQueryString,
  ): Promise<z.infer<(typeof getDataForEtablissementMapSchema.response)["200"]>> => {
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
      etablissements,
    }).map(formatEtablissement);

    const initialZoom = getInitialZoom({
      etablissement: formattedEtablissement,
      etablissementsProches: filteredEtablissements,
      mapDimensions: { height: filters.mapHeight, width: filters.mapWidth },
    });

    return {
      etablissementsProches: filteredEtablissements,
      etablissement: etablissement ? formattedEtablissement : undefined,
      initialZoom,
      center: {
        lat: formattedEtablissement.latitude,
        lng: formattedEtablissement.longitude,
      },
    };
  };

export const getDataForEtablissementMap = getDataForEtablissementMapFactory();
