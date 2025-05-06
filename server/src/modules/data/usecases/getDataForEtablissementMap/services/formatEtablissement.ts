import type { EtablissementSchema } from "shared/routes/schemas/get.etablissement.uai.map.schema";
import type { z } from "zod";

import type { EtablissementWithDistance } from "@/modules/data/usecases/getDataForEtablissementMap/getDataForEtablissementMap.usecase";

export function formatEtablissement(etablissement: EtablissementWithDistance): z.infer<typeof EtablissementSchema> {
  return {
    uai: etablissement.uai,
    latitude: etablissement.latitude ?? +Infinity,
    longitude: etablissement.longitude ?? +Infinity,
    voies: etablissement.voies ?? [],
    codeDepartement: etablissement.codeDepartement ?? "",
    libelleEtablissement: etablissement.libelleEtablissement ?? "",
    commune: etablissement.commune ?? "",
    libellesDispositifs: etablissement.libellesDispositifs.map((l) => (l === null ? "" : l)) ?? [],
    distance: etablissement.distance,
  };
}
