import { useEffect, useState } from "react";
import {
  CircleLayer,
  Layer,
  MapGeoJSONFeature,
  MapMouseEvent,
  MapRef,
  Popup,
  Source,
  SymbolLayer,
  useMap,
} from "react-map-gl/maplibre";

import { Etablissement } from "./Map_MAPLIBRE";

interface EtabsProps {
  etabs: Array<Etablissement>;
}

export const Etabs = ({ etabs }: EtabsProps) => {
  const [popupState, setPopupState] = useState({ show: false, lat: 0, lng: 0 });
  const { current: map } = useMap();

  const geojson = {
    type: "FeatureCollection",
    features: etabs.map((etab) => ({
      geometry: {
        type: "point",
        coordinates: [etab["longitude (X)"], etab["latitude (Y)"]],
      },
    })),
  };

  const clusterLayer: CircleLayer = {
    id: "clusters",
    type: "circle",
    source: "data",
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

  const onClusterClick = async (
    map: MapRef,
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[];
    }
  ) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [clusterLayer.id],
    });
    const clusterId = features[0].properties.cluster_id;

    const source = await map.getSource("data");
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
  };

  useEffect(() => {
    if (map !== undefined) {
      map.on("load", () => {
        map.off("click", clusterLayer.id, (e) => onClusterClick(map, e));
        map.on("click", clusterLayer.id, (e) => onClusterClick(map, e));
        map.on("click", clusterLayer.id, (e) => onClusterClick(map, e));
      });
    }
  }, [map]);

  return (
    <>
      <Source id="data" type="geojson" data={geojson} cluster={true} />
      <Layer {...clusterLayer} />
      <Layer {...clusterLabelLayer} />
      {popupState.show && (
        <Popup
          longitude={popupState.lng}
          latitude={popupState.lat}
          anchor="bottom"
          onClose={() => setPopupState({ ...popupState, show: false })}
        >
          You are here
        </Popup>
      )}
    </>
  );
};
