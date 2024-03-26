import { Layer, Source, SymbolLayer } from "react-map-gl/maplibre";

import { useEtablissementMapContext } from "../../../context/etablissementMapContext";
import { MAP_IMAGES } from "./CustomControls";

export const ActiveEtablissement = () => {
  const { etablissementMap, activeUai, etablissementsProches } =
    useEtablissementMapContext();
  const activeEtablissement =
    etablissementMap?.uai === activeUai
      ? etablissementMap
      : etablissementsProches.find((e) => e.uai === activeUai);

  const etablissementPoint = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [
        activeEtablissement?.longitude,
        activeEtablissement?.latitude,
      ],
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
    filter: ["all", ["in", "voies", "scolaire"], ["==", "uai", activeUai]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE_INVERTED.name,
      "icon-overlap": "always",
    },
  };

  const apprentissageInvertedSinglePointLayer: SymbolLayer = {
    id: "single-apprentissage-activeEtablissement-inverted",
    type: "symbol",
    source: "activeEtablissement",
    filter: ["all", ["in", "voies", "apprentissage"], ["==", "uai", activeUai]],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_APPRENTISSAGE_INVERTED.name,
      "icon-overlap": "always",
    },
  };

  const scolaireApprentissageInvertedSinglePointLayer: SymbolLayer = {
    id: "single-scolaire-apprentissage-activeEtablissement-inverted",
    type: "symbol",
    source: "activeEtablissement",
    filter: [
      "all",
      ["in", "voies", "apprentissage,scolaire"],
      ["==", "uai", activeUai],
    ],
    layout: {
      "icon-image": MAP_IMAGES.MAP_POINT_SCOLAIRE_APPRENTISSAGE_INVERTED.name,
      "icon-overlap": "always",
    },
  };

  return (
    <>
      <Source
        id="activeEtablissement"
        type="geojson"
        data={etablissementPoint}
      />
      {/**
       * We have to set a key to each layers to force re-rendere when the activeUai changes
       */}
      <Layer
        key={`activeEtablissement-point-scolaire-inverted-layer-${activeUai}`}
        {...scolaireInvertedSinglePointLayer}
      />
      <Layer
        key={`activeEtablissement-point-apprentissage-inverted-layer-${activeUai}`}
        {...apprentissageInvertedSinglePointLayer}
      />
      <Layer
        key={`activeEtablissement-point-scolaire-apprentissage-inverted-layer-${activeUai}`}
        {...scolaireApprentissageInvertedSinglePointLayer}
      />
    </>
  );
};
