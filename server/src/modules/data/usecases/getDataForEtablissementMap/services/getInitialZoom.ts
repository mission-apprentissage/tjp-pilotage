import { EtablissementProche } from "../getDataForEtablissementMap.usecase";

interface BoundingBox {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

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

export const getInitialZoom = (
  etablissementsProches: Array<EtablissementProche>
) => {
  const sortedEtablissementsProches = etablissementsProches.slice(
    0,
    CLOSEST_ETABLISSEMENTS
  );

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

  const zoomLevel = getZoomLevelFromBoundingBox(bbox);

  // We add a 0.5 padding to the zoom level to avoid having makers close to map borders
  return zoomLevel - 0.5;
};
