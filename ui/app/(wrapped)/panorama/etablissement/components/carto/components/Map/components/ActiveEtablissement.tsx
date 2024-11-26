import { usePlausible } from "next-plausible";
import { useEffect } from "react";
import type { MapGeoJSONFeature, MapMouseEvent, SymbolLayer } from "react-map-gl/maplibre";
import { Layer, Source, useMap } from "react-map-gl/maplibre";

import { useEtablissementMapContext } from "@/app/(wrapped)/panorama/etablissement/components/carto/context/etablissementMapContext";

import { MAP_IMAGES } from "./CustomControls";

export const ActiveEtablissement = () => {
  const { current: map } = useMap();
  const { etablissementMap, hoverUai, etablissementsProches, setActiveUai } = useEtablissementMapContext();
  const trackEvent = usePlausible();

  const etablissement = etablissementMap?.etablissement;
  const activeEtablissement =
    etablissement?.uai === hoverUai
      ? etablissement
      : etablissementsProches.find(
          // @ts-expect-error TODO
          (e) => e.uai === hoverUai
        );

  const etablissementPoint = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [activeEtablissement?.longitude, activeEtablissement?.latitude],
    },
    properties: {
      uai: activeEtablissement?.uai,
      // Attention, ici on utilise une string puisque les expressions de filtre de maplibre
      // ne permettent pas de vérifier les occurences dans un tableau
      voies: activeEtablissement?.voies.join(",") || "",
    },
  };

  const scolaireInvertedSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-activeEtablissement-inverted",
    type: "symbol",
    source: "activeEtablissement",
    filter: ["all", ["in", "voies", "scolaire"], ["==", "uai", hoverUai]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE_INVERTED.name,
      "icon-overlap": "always",
    },
  };

  const apprentissageInvertedSinglePointLayer: SymbolLayer = {
    id: "single-apprentissage-activeEtablissement-inverted",
    type: "symbol",
    source: "activeEtablissement",
    filter: ["all", ["in", "voies", "apprentissage"], ["==", "uai", hoverUai]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_APPRENTISSAGE_INVERTED.name,
      "icon-overlap": "always",
    },
  };

  const scolaireApprentissageInvertedSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-apprentissage-activeEtablissement-inverted",
    type: "symbol",
    source: "activeEtablissement",
    filter: ["all", ["in", "voies", "apprentissage,scolaire"], ["==", "uai", hoverUai]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE_APPRENTISSAGE_INVERTED.name,
      "icon-overlap": "always",
    },
  };

  const onSinglePointClick = async (
    e: MapMouseEvent & {
      features?: MapGeoJSONFeature[];
    }
  ) => {
    if (map !== undefined) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [
          scolaireInvertedSinglePointLayer.id,
          apprentissageInvertedSinglePointLayer.id,
          scolaireApprentissageInvertedSinglePointLayer.id,
        ],
      });

      if (features.length > 0 && features[0] !== undefined) {
        setActiveUai(features[0].properties.uai);
        trackEvent("cartographie-etablissement:interaction", {
          props: {
            type: "cartographie-etablissement-click",
            uai: features[0].properties.uai,
          },
        });
      }
    }
  };

  useEffect(() => {
    if (map !== undefined) {
      map.on("load", async () => {
        const singlePointLayers = [
          scolaireInvertedSinglePointLayer,
          apprentissageInvertedSinglePointLayer,
          scolaireApprentissageInvertedSinglePointLayer,
        ];

        singlePointLayers.forEach((layer) => {
          map.off("click", layer.id, onSinglePointClick);
          map.on("click", layer.id, onSinglePointClick);
        });

        if (etablissement) {
          setActiveUai(etablissement?.uai);
        }
      });
    }
  }, [map]);

  return (
    <>
      <Source id="activeEtablissement" type="geojson" data={etablissementPoint} />
      {/**
       * We have to set a key to each layers to force re-rendere when the hoverUai changes
       */}
      <Layer
        key={`activeEtablissement-point-scolaire-inverted-layer-${hoverUai}`}
        {...scolaireInvertedSinglePointLayer}
      />
      <Layer
        key={`activeEtablissement-point-apprentissage-inverted-layer-${hoverUai}`}
        {...apprentissageInvertedSinglePointLayer}
      />
      <Layer
        key={`activeEtablissement-point-scolaire-apprentissage-inverted-layer-${hoverUai}`}
        {...scolaireApprentissageInvertedSinglePointLayer}
      />
    </>
  );
};
