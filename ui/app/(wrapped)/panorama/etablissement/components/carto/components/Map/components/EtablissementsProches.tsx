import { Point } from "geojson";
import { useEffect, useState } from "react";
import {
  CircleLayer,
  GeoJSONSource,
  Layer,
  MapGeoJSONFeature,
  MapMouseEvent,
  Popup,
  Source,
  SymbolLayer,
  useMap,
} from "react-map-gl/maplibre";

import { themeDefinition } from "../../../../../../../../../theme/theme";
import { useEtablissementMapContext } from "../../../context/etablissementMapContext";
import { MAP_IMAGES } from "./CustomControls";

export const EtablissementsProches = () => {
  const [popupState, setPopupState] = useState({
    show: false,
    lat: 0,
    lng: 0,
    text: "",
  });

  const { current: map } = useMap();
  const { etablissementsProches, activeUais } = useEtablissementMapContext();

  const geojson = {
    type: "FeatureCollection",
    features: etablissementsProches.map((e) => ({
      geometry: {
        type: "Point",
        coordinates: [e.longitude, e.latitude],
      },
      properties: {
        uai: e.uai,
        // Attention, ici on utilise une string puisque les expressions de filtre de maplibre
        // ne permettent pas de vérifier les occurences dans un tableau
        voies: e.voies.join(","),
      },
    })),
  };

  const clusterLayer: CircleLayer = {
    id: "cluster-etablissementsProches",
    type: "circle",
    source: "etablissementsProches",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        themeDefinition.colors.bluefrance[113],
        100,
        themeDefinition.colors.bluefrance[113],
        750,
        themeDefinition.colors.bluefrance[113],
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
  };

  const clusterLabelLayer: SymbolLayer = {
    id: "cluster-count-etablissementsProches",
    type: "symbol",
    source: "etablissementsProches",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-size": 12,
    },
    paint: {
      "text-color": "white",
    },
  };

  const scolaireSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-points-etablissementsProches",
    type: "symbol",
    source: "etablissementsProches",
    filter: ["all", ["!has", "point_count"], ["in", "voies", "scolaire"]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE.name,
    },
  };

  const scolaireInvertedSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-points-etablissementsProches",
    type: "symbol",
    source: "etablissementsProches",
    filter: [
      "all",
      ["!has", "point_count"],
      ["in", "voies", "scolaire"],
      ["in", "uai", ...activeUais],
    ],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE_INVERTED.name,
    },
  };

  const apprentissageSinglePointLayer: SymbolLayer = {
    id: "single-apprentissage-points-etablissementsProches",
    type: "symbol",
    source: "etablissementsProches",
    filter: ["all", ["!has", "point_count"], ["in", "voies", "apprentissage"]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_APPRENTISSAGE.name,
    },
  };

  const apprentissageInvertedSinglePointLayer: SymbolLayer = {
    id: "single-apprentissage-points-etablissementsProches",
    type: "symbol",
    source: "etablissementsProches",
    filter: [
      "all",
      ["!has", "point_count"],
      ["in", "voies", "apprentissage"],
      ["in", "uai", ...activeUais],
    ],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_APPRENTISSAGE_INVERTED.name,
    },
  };

  const scolaireApprentissageSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-apprentissage-points-etablissementsProches",
    type: "symbol",
    source: "etablissementsProches",
    filter: [
      "all",
      ["!has", "point_count"],
      ["in", "voies", "apprentissage,scolaire"],
    ],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE_APPRENTISSAGE.name,
    },
  };

  const scolaireApprentissageInvertedSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-apprentissage-points-etablissementsProches",
    type: "symbol",
    source: "etablissementsProches",
    filter: [
      "all",
      ["!has", "point_count"],
      ["in", "voies", "apprentissage,scolaire"],
      ["in", "uai", ...activeUais],
    ],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE_APPRENTISSAGE_INVERTED.name,
    },
  };

  const onClusterClick = async (
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[];
    }
  ) => {
    if (map !== undefined) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [clusterLayer.id],
      });
      const clusterId = features[0].properties.cluster_id;

      const source = (await map.getSource(
        "etablissementsProches"
      )) as GeoJSONSource;
      if (source && "getClusterExpansionZoom" in source) {
        const clusterZoom = await source.getClusterExpansionZoom(clusterId);
        map.easeTo({
          center:
            "coordinates" in features[0].geometry
              ? (features[0].geometry.coordinates as [number, number])
              : [-1, -1],
          zoom: clusterZoom,
        });
      }
    }
  };

  const onSinglePointClick = async (
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[];
    }
  ) => {
    if (map !== undefined) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [scolaireSinglePointLayer.id],
      });
      const point = features[0].geometry as Point;
      setPopupState({
        show: true,
        lng: point.coordinates[0],
        lat: point.coordinates[1],
        text: features[0].properties?.uai,
      });
    }
  };

  useEffect(() => {
    if (map !== undefined) {
      map.on("load", async () => {
        map.off("click", clusterLayer.id, onClusterClick);
        map.on("click", clusterLayer.id, onClusterClick);

        map.off("click", scolaireSinglePointLayer.id, onSinglePointClick);
        map.on("click", scolaireSinglePointLayer.id, onSinglePointClick);
      });
    }
  }, [map]);

  return (
    <>
      <Source
        id="etablissementsProches"
        type="geojson"
        data={geojson}
        cluster={true}
      />
      <Layer {...clusterLayer} />
      <Layer {...clusterLabelLayer} />
      <Layer {...scolaireSinglePointLayer} />
      <Layer {...scolaireInvertedSinglePointLayer} />
      <Layer {...apprentissageSinglePointLayer} />
      <Layer {...apprentissageInvertedSinglePointLayer} />
      <Layer {...scolaireApprentissageSinglePointLayer} />
      <Layer {...scolaireApprentissageInvertedSinglePointLayer} />
      {popupState.show && (
        <Popup
          longitude={popupState.lng}
          latitude={popupState.lat}
          anchor="bottom"
          onClose={() => setPopupState({ ...popupState, show: false })}
        >
          {popupState.text}
        </Popup>
      )}
    </>
  );
};
