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

import { useEtablissementMapContext } from "../../../context/etablissementMapContext";

const MAP_IMAGES = {
  MAP_POINT_APPRENTISSAGE: {
    path: "/map/map_point_apprentissage.png",
    name: "map_point_apprentissage",
  },
  MAP_POINT_SCOLAIRE_APPRENTISSAGE: {
    path: "/map/map_point_scolaire_apprentissage.png",
    name: "map_point_scolaire_apprentissage",
  },
  MAP_POINT_SCOLAIRE: {
    path: "/map/map_point_scolaire.png",
    name: "map_point_scolaire",
  },
};

export const EtablissementsProches = () => {
  const [popupState, setPopupState] = useState({
    show: false,
    lat: 0,
    lng: 0,
    text: "",
  });

  const { current: map } = useMap();
  const { etablissementsProches } = useEtablissementMapContext();

  const geojson = {
    type: "FeatureCollection",
    features: etablissementsProches.map((e) => ({
      geometry: {
        type: "point",
        coordinates: [e.longitude, e.latitude],
      },
      properties: {
        uai: e.uai,
        voie: e.voie,
      },
    })),
  };

  console.log(geojson);

  const clusterLayer: CircleLayer = {
    id: "clusters",
    type: "circle",
    source: "data",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#51bbd6",
        100,
        "#f1f075",
        750,
        "#f28cb1",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
    },
  };

  const clusterLabelLayer: SymbolLayer = {
    id: "clusters-count",
    type: "symbol",
    source: "data",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-size": 12,
    },
  };

  const scolaireSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-points",
    type: "symbol",
    source: "data",
    filter: ["all", ["!has", "point_count"], ["in", "voie", "scolaire"]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE.name,
    },
  };

  const apprentissageSinglePointLayer: SymbolLayer = {
    id: "single-apprentissage-points",
    type: "symbol",
    source: "data",
    filter: ["all", ["!has", "point_count"], ["in", "voie", "apprentissage"]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_APPRENTISSAGE.name,
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

      const source = (await map.getSource("data")) as GeoJSONSource;
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

  const loadImageOnMap = async (image: { path: string; name: string }) => {
    if (map !== undefined) {
      const loadedImage = await map.loadImage(image.path);
      if (map.hasImage(image.name)) {
        map.updateImage(image.name, loadedImage.data);
      } else {
        map.addImage(image.name, loadedImage.data);
      }
    }
  };

  useEffect(() => {
    if (map !== undefined) {
      map.on("load", async () => {
        await Promise.all(
          Object.values(MAP_IMAGES).map(
            async (image) => await loadImageOnMap(image)
          )
        );

        map.off("click", clusterLayer.id, onClusterClick);
        map.on("click", clusterLayer.id, onClusterClick);

        map.off("click", scolaireSinglePointLayer.id, onSinglePointClick);
        map.on("click", scolaireSinglePointLayer.id, onSinglePointClick);
      });
    }
  }, [map]);

  return (
    <>
      <Source id="data" type="geojson" data={geojson} cluster={true} />
      <Layer {...clusterLayer} />
      <Layer {...clusterLabelLayer} />
      <Layer {...scolaireSinglePointLayer} />
      <Layer {...apprentissageSinglePointLayer} />
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
