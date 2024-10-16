import type { z } from "zod";

import type { EtablissementSchema } from "@/modules/data/usecases/getFormationCarteEtablissements/getFormationCarteEtablissements.schema";

interface BoundingBox {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

type EtablissementSchemaType = z.infer<typeof EtablissementSchema>;

function latRad(lat: number) {
  const sin = Math.sin((lat * Math.PI) / 180);
  const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
  return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
}

function zoom(mapPx: number, worldPx: number, fraction: number) {
  return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
}

// cf. https://stackoverflow.com/questions/4266754/how-to-calculate-google-maps-zoom-level-for-a-bounding-box-in-java
const getZoomLevelFromBoundingBox = ({
  bbox: { latMin, latMax, lngMin, lngMax },
  mapDimensions: { height, width },
}: {
  bbox: BoundingBox;
  mapDimensions: { height: number; width: number };
}) => {
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 19;

  const latFraction = (latRad(latMax) - latRad(latMin)) / Math.PI;

  const lngDiff = lngMax - lngMin;
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

  const latZoom = zoom(height, WORLD_DIM.height, latFraction);
  const lngZoom = zoom(width, WORLD_DIM.width, lngFraction);

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
};

export const getInitialZoom = ({
  etablissements,
  mapDimensions,
}: {
  etablissements: Array<EtablissementSchemaType>;
  mapDimensions: { height: number; width: number };
}) => {
  let initialZoom = 11;

  const bbox = {
    latMin: etablissements[0].latitude,
    latMax: etablissements[0].latitude,
    lngMin: etablissements[0].longitude,
    lngMax: etablissements[0].longitude,
  };

  etablissements.forEach((etablissement) => {
    if (etablissement.latitude < bbox.latMin) {
      bbox.latMin = etablissement.latitude;
    }

    if (etablissement.latitude > bbox.latMax) {
      bbox.latMax = etablissement.latitude;
    }

    if (etablissement.longitude < bbox.lngMin) {
      bbox.lngMin = etablissement.longitude;
    }

    if (etablissement.longitude > bbox.lngMax) {
      bbox.lngMax = etablissement.longitude;
    }
  });

  initialZoom = getZoomLevelFromBoundingBox({
    bbox,
    mapDimensions,
  });

  // Dans certains cas, le zoom level peut être à NaN (établissements sur
  // les memes coordonnées par ex)
  if (Number.isNaN(initialZoom)) {
    initialZoom = 11;
  }

  // We add a 1 padding to the zoom level to avoid having makers close to map borders
  const normalizedZoom = initialZoom - 0.5;

  return {
    zoom: normalizedZoom > 13 ? 13 : normalizedZoom,
    bbox,
  };
};
