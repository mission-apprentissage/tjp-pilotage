import { useEffect } from "react";
import {
  CircleLayer,
  Layer,
  Source,
  SymbolLayer,
  useMap,
} from "react-map-gl/maplibre";

import { themeDefinition } from "../../../../../../../../../theme/theme";
import { useEtablissementMapContext } from "../../../context/etablissementMapContext";
import { MAP_IMAGES } from "./CustomControls";

export const Etablissement = () => {
  const { current: map } = useMap();
  const { etablissementMap, activeUais } = useEtablissementMapContext();

  const etablissementPoint = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [etablissementMap?.longitude, etablissementMap?.latitude],
    },
    properties: {
      uai: etablissementMap?.uai,
      // Attention, ici on utilise une string puisque les expressions de filtre de maplibre
      // ne permettent pas de vérifier les occurences dans un tableau
      voies: etablissementMap?.voies.join(",") || "",
    },
  };

  console.log(etablissementMap);

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
    id: "single-scolaire-point-etablissement",
    type: "symbol",
    source: "etablissement",
    filter: ["in", "voies", "scolaire"],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE.name,
    },
  };

  const scolaireInvertedSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-point-etablissement",
    type: "symbol",
    source: "etablissement",
    filter: ["all", ["in", "voies", "scolaire"], ["in", "uai", ...activeUais]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE_INVERTED.name,
    },
  };

  const apprentissageSinglePointLayer: SymbolLayer = {
    id: "single-apprentissage-point-etablissement",
    type: "symbol",
    source: "etablissement",
    filter: ["in", "voies", "apprentissage"],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_APPRENTISSAGE.name,
    },
  };

  const apprentissageInvertedSinglePointLayer: SymbolLayer = {
    id: "single-apprentissage-point-etablissement",
    type: "symbol",
    source: "etablissement",
    filter: [
      "all",
      ["in", "voies", "apprentissage"],
      ["in", "uai", ...activeUais],
    ],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_APPRENTISSAGE_INVERTED.name,
    },
  };

  const scolaireApprentissageSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-apprentissage-point-etablissement",
    type: "symbol",
    source: "etablissement",
    filter: ["in", "voies", "apprentissage,scolaire"],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE_APPRENTISSAGE.name,
    },
  };

  const scolaireApprentissageInvertedSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-apprentissage-point-etablissement",
    type: "symbol",
    source: "etablissement",
    filter: [
      "all",
      ["in", "voies", "apprentissage,scolaire"],
      ["in", "uai", ...activeUais],
    ],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE_APPRENTISSAGE_INVERTED.name,
    },
  };

  const flyToEtablissement = () => {
    if (etablissementMap && map !== undefined) {
      map.flyTo({
        center: {
          lng: etablissementMap.longitude,
          lat: etablissementMap.latitude,
        },
        zoom: etablissementMap.initialZoom,
      });
    }
  };

  useEffect(() => {
    if (map !== undefined) {
      map.on("load", async () => {
        flyToEtablissement();
      });
    }
  }, [map]);

  if (!etablissementMap) {
    return <></>;
  }

  return (
    <>
      <Source id="etablissement" type="geojson" data={etablissementPoint} />
      <Layer {...pointBackgroundLayer} />
      <Layer {...scolaireSinglePointLayer} />
      <Layer {...scolaireInvertedSinglePointLayer} />
      <Layer {...apprentissageSinglePointLayer} />
      <Layer {...apprentissageInvertedSinglePointLayer} />
      <Layer {...scolaireApprentissageSinglePointLayer} />
      <Layer {...scolaireApprentissageInvertedSinglePointLayer} />
    </>
  );
};
