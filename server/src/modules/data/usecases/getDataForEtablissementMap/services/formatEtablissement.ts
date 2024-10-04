import { z } from "zod";

import { EtablissementSchema } from "../getDataForEtablissementMap.schema";
import { EtablissementWithDistance } from "../getDataForEtablissementMap.usecase";

export function formatEtablissement(
  etablissement: EtablissementWithDistance
): z.infer<typeof EtablissementSchema> {
  return {
    uai: etablissement.uai,
    latitude: etablissement.latitude || +Infinity,
    longitude: etablissement.longitude || +Infinity,
    voies: etablissement.voies || [],
    codeDepartement: etablissement.codeDepartement || "",
    libelleEtablissement: etablissement.libelleEtablissement || "",
    commune: etablissement.commune || "",
    libellesDispositifs:
      etablissement.libellesDispositifs.map((l) => (l === null ? "" : l)) || [],
    distance: etablissement.distance,
  };
}
