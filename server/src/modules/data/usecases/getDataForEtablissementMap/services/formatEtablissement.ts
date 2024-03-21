import { z } from "zod";

import { EtablissementSchema } from "../getDataForEtablissementMap.schema";
import { EtablissementWithDistance } from "../getDataForEtablissementMap.usecase";

export function formatEtablissement(
  etablissement: EtablissementWithDistance
): z.infer<typeof EtablissementSchema> {
  return {
    uai: etablissement.UAI,
    latitude: etablissement.latitude || +Infinity,
    longitude: etablissement.longitude || +Infinity,
    voie: etablissement.voie || "",
    codeDepartement: etablissement.codeDepartement || "",
    libelleEtablissement: etablissement.libelleEtablissement || "",
    commune: etablissement.commune || "",
    libelleDispositif: etablissement.libelleDispositif || "",
    distance: etablissement.distance,
  };
}
