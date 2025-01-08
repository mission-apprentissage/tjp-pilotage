import { getDistance as getGeoDistance } from "geolib";

import type {
  Etablissement,
  EtablissementWithDistance,
} from "@/modules/data/usecases/getDataForEtablissementMap/getDataForEtablissementMap.usecase";

interface FilterByDistanceParams {
  etablissement: Etablissement;
  etablissements: Array<Etablissement>;
}

/**
 * Calcule la distance en km depuis le point initial (l'établissement source) jusqu'aux points finaux.
 *
 * @param {FilterByDistanceParams} param - Un objet contenant l'établissement (point initial) and la liste d'établissements (points finaux)
 * @return {Array<EtablissementWithDistance>} Un tableau d'EtablissementsProches avec leur distance depuis le point initial en km
 */
export function getDistance({
  etablissement,
  etablissements,
}: FilterByDistanceParams): Array<EtablissementWithDistance> {
  const etablissementsWithDistance = etablissements
    .map((e) => {
      if (!e?.latitude || !e?.longitude || !etablissement.latitude || !etablissement.longitude) return;

      // get distance in metters
      const distance = getGeoDistance(
        {
          latitude: etablissement.latitude,
          longitude: etablissement.longitude,
        },
        { latitude: e.latitude, longitude: e.longitude },
      );

      return {
        ...e,
        distance: distance / 1000,
      };
    })
    .filter((e) => e !== undefined) as Array<EtablissementWithDistance>;

  return etablissementsWithDistance.sort((a, b) => a?.distance - b?.distance);
}
