import { useEffect } from "react";
import {
  CircleLayer,
  GeoJSONSource,
  Layer,
  MapGeoJSONFeature,
  MapMouseEvent,
  Source,
  SymbolLayer,
  useMap,
} from "react-map-gl/maplibre";

import { themeDefinition } from "../../../../../../../../../theme/theme";
import { useEtablissementMapContext } from "../../../context/etablissementMapContext";
import { MAP_IMAGES } from "./CustomControls";

export const EtablissementsProches = () => {
  const { current: map } = useMap();
  const { etablissementsProches, hoverUai, setHoverUai } =
    useEtablissementMapContext();

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
      "text-overlap": "always",
    },
    paint: {
      "text-color": "white",
    },
  };

  const scolaireSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-etablissementsProches",
    type: "symbol",
    source: "etablissementsProches",
    filter: [
      "all",
      ["!has", "point_count"],
      ["in", "voies", "scolaire"],
      ["!=", "uai", hoverUai],
    ],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE.name,
      "icon-overlap": "always",
    },
  };

  const apprentissageSinglePointLayer: SymbolLayer = {
    id: "single-apprentissage-etablissementsProches",
    type: "symbol",
    source: "etablissementsProches",
    filter: [
      "all",
      ["!has", "point_count"],
      ["in", "voies", "apprentissage"],
      ["!=", "uai", hoverUai],
    ],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_APPRENTISSAGE.name,
      "icon-overlap": "always",
    },
  };

  const scolaireApprentissageSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-apprentissage-etablissementsProches",
    type: "symbol",
    source: "etablissementsProches",
    filter: [
      "all",
      ["!has", "point_count"],
      ["in", "voies", "apprentissage,scolaire"],
      ["!=", "uai", hoverUai],
    ],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE_APPRENTISSAGE.name,
      "icon-overlap": "always",
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

  const onSinglePointOver = async (
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[];
    }
  ) => {
    if (map !== undefined) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [
          scolaireSinglePointLayer.id,
          apprentissageSinglePointLayer.id,
          scolaireApprentissageSinglePointLayer.id,
        ],
      });

      if (features.length > 0 && features[0] !== undefined) {
        setHoverUai(features[0].properties.uai);
      }
    }
  };

  useEffect(() => {
    if (map !== undefined) {
      map.on("load", async () => {
        map.off("click", clusterLayer.id, onClusterClick);
        map.on("click", clusterLayer.id, onClusterClick);

        const singlePointLayers = [
          scolaireSinglePointLayer,
          scolaireApprentissageSinglePointLayer,
          apprentissageSinglePointLayer,
        ];

        singlePointLayers.forEach((layer) => {
          map.off("mouseover", layer.id, onSinglePointOver);
          map.on("mouseover", layer.id, onSinglePointOver);
        });
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
      <Layer {...apprentissageSinglePointLayer} />
      <Layer {...scolaireApprentissageSinglePointLayer} />
    </>
  );
};
