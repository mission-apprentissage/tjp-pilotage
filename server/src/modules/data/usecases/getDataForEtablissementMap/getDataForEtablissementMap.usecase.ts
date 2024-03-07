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
      getFormation: dependencies.getFormation,
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

    const etablissements = await deps.getEtablissementsProches({ ...filters });

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
