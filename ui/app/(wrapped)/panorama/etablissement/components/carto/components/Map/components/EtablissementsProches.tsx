import { Point } from "geojson";
import { MapLibreEvent } from "maplibre-gl";
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

import { client } from "../../../../../../../../../api.client";

interface EtablissementsProchesProps {
  etablissementsProches: (typeof client.infer)["[GET]/etablissement/:uai/map"]["etablissementsProches"];
}

export const EtablissementsProches = ({
  etablissementsProches,
}: EtablissementsProchesProps) => {
  const [popupState, setPopupState] = useState({
    show: false,
    lat: 0,
    lng: 0,
    text: "",
  });

  const { current: map } = useMap();

  const geojson = {
    type: "FeatureCollection",
    features: etablissementsProches.map((e) => ({
      geometry: {
        type: "point",
        coordinates: [e.longitude, e.latitude],
      },
      properties: {
        uai: e.uai,
      },
    })),
  };

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

  const singlePointLayer: SymbolLayer = {
    id: "single-points",
    type: "symbol",
    source: "data",
    filter: ["!", ["has", "point_count"]],
    layout: {
      "icon-image": "map_point",
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
        layers: [singlePointLayer.id],
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
        map.removeImage("map_point");
        const img = await map.loadImage("/map_point.png");
        map.addImage("map_point", img.data);

        map.off("click", clusterLayer.id, onClusterClick);
        map.on("click", clusterLayer.id, onClusterClick);

        map.off("click", singlePointLayer.id, onSinglePointClick);
        map.on("click", singlePointLayer.id, onSinglePointClick);

        map.off("moveend", onZoomEnd);
        map.on("moveend", onZoomEnd);
      });
    }
  }, [map]);

  const onZoomEnd = (
    e: MapLibreEvent<MouseEvent | TouchEvent | WheelEvent | undefined>
  ) => {
    if (map !== undefined) {
      console.log(map.getMap().getBounds(), e);
    }
  };

  return (
    <>
      <Source id="data" type="geojson" data={geojson} cluster={true} />
      <Layer {...clusterLayer} />
      <Layer {...clusterLabelLayer} />
      <Layer {...singlePointLayer} />
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
