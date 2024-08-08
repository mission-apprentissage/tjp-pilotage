import z from "zod";

import { EtablissementSchema } from "../getDataForEtablissementMapList.schema";
import { EtablissementWithDistance } from "../getDataForEtablissementMapList.usecase";

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
    effectif: etablissement.effectif || undefined,
    tauxInsertion: etablissement.tauxInsertion || undefined,
    tauxPoursuite: etablissement.tauxPoursuite || undefined,
    secteur: etablissement.secteur || undefined,
    libelleAcademie: etablissement.libelleAcademie,
    libelleRegion: etablissement.libelleRegion,
    libelleFormation: etablissement.libelleFormation || "",
  };
}
