import { EtablissementProche } from "../getDataForEtablissementMap.usecase";
import { EtablissementWithDistance } from "./filterByDistance";

export function formatEtablissement(
  etablissement: EtablissementWithDistance
): EtablissementProche {
  return {
    uai: etablissement.UAI,
    latitude: etablissement.latitude || +Infinity,
    longitude: etablissement.longitude || +Infinity,
    distance: etablissement.distance,
  };
}
