import { getDistance } from "geolib";
import { Selectable } from "kysely";

import { DB } from "../../../../../db/schema";

export interface EtablissementWithDistance
  extends Selectable<DB["etablissement"]> {
  distance: number;
}

interface FilterByDistanceParams {
  etablissement: Selectable<DB["etablissement"]>;
  etablissements: Array<Selectable<DB["etablissement"]>>;
}

export function filterByDistance({
  etablissement,
  etablissements,
}: FilterByDistanceParams): Array<EtablissementWithDistance> {
  return etablissements
    .map((e) => {
      if (
        !e?.latitude ||
        !e?.longitude ||
        !etablissement.latitude ||
        !etablissement.longitude
      )
        return;

      // get distance in metters
      const distance = getDistance(
        {
          latitude: etablissement.latitude,
          longitude: etablissement.longitude,
        },
        { latitude: e.latitude, longitude: e.longitude }
      );

      return {
        ...e,
        distance: distance / 1000,
      };
    })
    .filter((e) => e !== undefined) as Array<EtablissementWithDistance>;
}
