import { z } from "zod";

import { EtablissementSchema } from "../getDataForEtablissementMap.schema";

interface BoundingBox {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

type EtablissementSchemaType = z.infer<typeof EtablissementSchema>;

const CLOSEST_ETABLISSEMENTS = 10;

// cf. https://stackoverflow.com/questions/4266754/how-to-calculate-google-maps-zoom-level-for-a-bounding-box-in-java
const getZoomLevelFromBoundingBox = ({
  latMin,
  latMax,
  lngMin,
  lngMax,
}: BoundingBox) => {
  let zoomLevel;
  const latDiff = latMax - latMin;
  const lngDiff = lngMax - lngMin;

  const maxDiff = lngDiff > latDiff ? lngDiff : latDiff;
  if (maxDiff < 360 / Math.pow(2, 20)) {
    zoomLevel = 21;
  } else {
    zoomLevel =
      -1 * (Math.log(maxDiff) / Math.log(2) - Math.log(360) / Math.log(2));
    if (zoomLevel < 1) zoomLevel = 1;
  }

  return zoomLevel;
};

const getGroupMean = (group: Array<EtablissementSchemaType>) => {
  return group.reduce((a, b) => a + b.distance, 0) / group.length;
};

const getEtablissementContext = (
  etablissementsProches: Array<EtablissementSchemaType>
) => {
  const group: Array<EtablissementSchemaType> = [];

  etablissementsProches.forEach((etablissement) => {
    if (group.length === 0) {
      group.push(etablissement);
    }

    if (
      getGroupMean(group) * 1.5 > etablissement.distance &&
      group.length < CLOSEST_ETABLISSEMENTS &&
      group.findIndex(
        (groupEtablissement) => etablissement.uai === groupEtablissement.uai
      ) === -1
    ) {
      group.push(etablissement);
    }

    if (
      getGroupMean(group) * 3 > etablissement.distance &&
      group.length < CLOSEST_ETABLISSEMENTS &&
      group.findIndex(
        (groupEtablissement) => etablissement.uai === groupEtablissement.uai
      ) === -1
    ) {
      group.push(etablissement);
      return;
    }
  });

  return group;
};

export const getInitialZoom = (
  etablissement: EtablissementSchemaType,
  etablissementsProches: Array<EtablissementSchemaType>
) => {
  const sortedEtablissementsProches = getEtablissementContext(
    etablissementsProches
  );

  if (etablissementsProches.length === 0) {
    return 11;
  }

  const bbox = {
    latMin: etablissementsProches[0].latitude,
    latMax: etablissementsProches[0].latitude,
    lngMin: etablissementsProches[0].longitude,
    lngMax: etablissementsProches[0].longitude,
  };

  sortedEtablissementsProches.forEach((etablissement) => {
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

  const latDiff = bbox.latMax - bbox.latMin;
  const lngDiff = bbox.lngMax - bbox.lngMin;
  const maxDiff = lngDiff > latDiff ? lngDiff : latDiff;

  const zoomLevel = getZoomLevelFromBoundingBox(bbox);
  // We add a 1 padding to the zoom level to avoid having makers close to map borders
  const normalizedZoomLevel = zoomLevel - Math.log(maxDiff * 2) / Math.log(2);

  return normalizedZoomLevel > 13 ? 13 : normalizedZoomLevel;
};
