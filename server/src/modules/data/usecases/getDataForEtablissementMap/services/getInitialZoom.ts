import { computeDestinationPoint, getRhumbLineBearing } from "geolib";
import { pick } from "lodash-es";
import type { EtablissementSchema } from "shared/routes/schemas/get.etablissement.uai.map.schema";
import type { z } from "zod";

interface BoundingBox {
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
}

type EtablissementSchemaType = z.infer<typeof EtablissementSchema>;

const CLOSEST_ETABLISSEMENTS = 10;

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

const getGroupMean = (group: Array<EtablissementSchemaType>) => {
  return group.reduce((a, b) => a + b.distance, 0) / group.length;
};

const getEtablissementContext = (etablissementsProches: Array<EtablissementSchemaType>) => {
  const group: Array<EtablissementSchemaType> = [];

  etablissementsProches.forEach((etablissement) => {
    if (group.length < 2) {
      group.push(etablissement);
    } else if (getGroupMean(group) * 3 > etablissement.distance && group.length < CLOSEST_ETABLISSEMENTS) {
      group.push(etablissement);
    }
  });

  return group;
};

export const getInitialZoom = ({
  etablissement,
  etablissementsProches,
  mapDimensions,
}: {
  etablissement: EtablissementSchemaType;
  etablissementsProches: Array<EtablissementSchemaType>;
  mapDimensions: { height: number; width: number };
}) => {
  const sortedEtablissementsProches = getEtablissementContext(etablissementsProches);

  if (etablissementsProches.length < 2) {
    return 11;
  }

  const projectedEtablissementsProches: Array<EtablissementSchemaType> = [];

  // Pour avoir une bounding box qui correpond à ce que l'on souhaite,
  // On doit placer l'établissement principal au centre et projeter
  // les établissements proches par rapport à celui-ci.
  // On créé donc une copie de chaque établissement proche à partir de l'établissement de référence
  if (sortedEtablissementsProches[0].uai === etablissement.uai) {
    sortedEtablissementsProches.forEach((etablissementProche, i) => {
      projectedEtablissementsProches.push(etablissementProche);
      if (i > 0) {
        const bearing = getRhumbLineBearing(
          pick(etablissement, ["latitude", "longitude"]),
          pick(etablissementProche, ["latitude", "longitude"]),
        );

        const destinationPoint = computeDestinationPoint(
          pick(etablissement, ["latitude", "longitude"]),
          // On doit ici fournir une distance en m (d'où le x1000)
          // On doit doubler celle-ci pour que l'on puisse projeter suivant sa Rhumb line,
          // et que l'établissement de référence soit au centre
          etablissementProche.distance * 1000 * 2,
          bearing,
        );

        projectedEtablissementsProches.push({
          ...etablissementProche,
          latitude: destinationPoint.latitude,
          longitude: destinationPoint.longitude,
        });
      }
    });
  } else {
    projectedEtablissementsProches.push(...sortedEtablissementsProches);
  }

  const bbox = {
    latMin: projectedEtablissementsProches[0].latitude,
    latMax: projectedEtablissementsProches[0].latitude,
    lngMin: projectedEtablissementsProches[0].longitude,
    lngMax: projectedEtablissementsProches[0].longitude,
  };

  projectedEtablissementsProches.forEach((etablissementProche) => {
    if (etablissementProche.latitude < bbox.latMin) {
      bbox.latMin = etablissementProche.latitude;
    }

    if (etablissementProche.latitude > bbox.latMax) {
      bbox.latMax = etablissementProche.latitude;
    }

    if (etablissementProche.longitude < bbox.lngMin) {
      bbox.lngMin = etablissementProche.longitude;
    }

    if (etablissementProche.longitude > bbox.lngMax) {
      bbox.lngMax = etablissementProche.longitude;
    }
  });

  const zoomLevel = getZoomLevelFromBoundingBox({
    bbox,
    mapDimensions,
  });

  // Dans certains cas, le zoom level peut être à NaN (établissements sur
  // les memes coordonnées par ex)
  if (Number.isNaN(zoomLevel)) {
    return 11;
  }

  // We add a 1 padding to the zoom level to avoid having makers close to map borders
  const normalizedZoom = zoomLevel - 0.5;

  return normalizedZoom > 13 ? 13 : normalizedZoom;
};
