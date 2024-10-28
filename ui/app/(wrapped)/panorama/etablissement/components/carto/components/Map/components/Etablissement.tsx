import { usePlausible } from "next-plausible";
import { useEffect } from "react";
import type { CircleLayer, MapGeoJSONFeature, MapMouseEvent, SymbolLayer } from "react-map-gl/maplibre";
import { Layer, Source, useMap } from "react-map-gl/maplibre";

import { useEtablissementMapContext } from "@/app/(wrapped)/panorama/etablissement/components/carto/context/etablissementMapContext";
import { themeDefinition } from "@/theme/theme";

import { MAP_IMAGES } from "./CustomControls";

export const Etablissement = () => {
  const { current: map } = useMap();
  const { etablissementMap, hoverUai, setActiveUai, setHoverUai } = useEtablissementMapContext();
  const trackEvent = usePlausible();

  const etablissement = etablissementMap?.etablissement;
  const showEtablissement =
    etablissementMap?.etablissementsProches.findIndex((e) => e.uai === etablissement?.uai) !== -1;

  const etablissementPoint = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [etablissement?.longitude, etablissement?.latitude],
    },
    properties: {
      uai: etablissement?.uai,
      // Attention, ici on utilise une string puisque les expressions de filtre de maplibre
      // ne permettent pas de vérifier les occurences dans un tableau
      voies: etablissement?.voies.join(",") || "",
    },
  };

  const pointBackgroundLayer: CircleLayer = {
    id: "background-layer-etablissement",
    type: "circle",
    source: "etablissement",
    paint: {
      "circle-color": themeDefinition.colors.bluefrance[113],
      "circle-radius": 20,
    },
  };

  const scolaireSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-etablissement",
    type: "symbol",
    source: "etablissement",
    filter: ["all", ["in", "voies", "scolaire"], ["!=", "uai", hoverUai]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE.name,
      "icon-overlap": "always",
    },
  };

  const apprentissageSinglePointLayer: SymbolLayer = {
    id: "single-apprentissage-etablissement",
    type: "symbol",
    source: "etablissement",
    filter: ["all", ["in", "voies", "apprentissage"], ["!=", "uai", hoverUai]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_APPRENTISSAGE.name,
      "icon-overlap": "always",
    },
  };

  const scolaireApprentissageSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-apprentissage-etablissement",
    type: "symbol",
    source: "etablissement",
    filter: ["all", ["in", "voies", "apprentissage,scolaire"], ["!=", "uai", hoverUai]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE_APPRENTISSAGE.name,
      "icon-overlap": "always",
    },
  };

  const flyToEtablissement = () => {
    if (etablissementMap !== undefined && etablissement !== undefined && map !== undefined) {
      map.flyTo({
        center: {
          lng: etablissement.longitude,
          lat: etablissement.latitude,
        },
        zoom: etablissementMap.initialZoom,
      });
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
        setHoverUai(features[0].properties?.uai);

        trackEvent("cartographie-etablissement:interaction", {
          props: {
            type: "cartographie-etablissement-hover",
            uai: features[0].properties.uai,
          },
        });
      }
    }
  };

  useEffect(() => {
    if (map !== undefined) {
      map.on("load", async () => {
        flyToEtablissement();

        const singlePointLayers = [
          scolaireSinglePointLayer,
          apprentissageSinglePointLayer,
          scolaireApprentissageSinglePointLayer,
        ];

        singlePointLayers.forEach((layer) => {
          map.off("mouseover", layer.id, onSinglePointOver);
          map.on("mouseover", layer.id, onSinglePointOver);
        });

        if (etablissementMap?.etablissement) {
          setActiveUai(etablissementMap.etablissement.uai);
        }
      });
    }
  }, [map]);

  if (!etablissementMap?.etablissement) {
    return <></>;
  }

  return (
    <>
      <Source id="etablissement" type="geojson" data={etablissementPoint} />
      {showEtablissement && (
        <>
          <Layer {...pointBackgroundLayer} />
          <Layer {...scolaireSinglePointLayer} />
          <Layer {...apprentissageSinglePointLayer} />
          <Layer {...scolaireApprentissageSinglePointLayer} />
        </>
      )}
    </>
  );
};
