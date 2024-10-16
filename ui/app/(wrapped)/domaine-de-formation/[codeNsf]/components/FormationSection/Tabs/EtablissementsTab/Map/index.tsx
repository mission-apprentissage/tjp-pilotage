import "maplibre-gl/dist/maplibre-gl.css";

import { Skeleton } from "@chakra-ui/react";
import { useState } from "react";
import MapGLMap, {
  MapRef,
  NavigationControl,
  ScaleControl,
} from "react-map-gl/maplibre";

import { Etablissement } from "../../../../../types";
import { ActiveEtablissementLayers } from "./ActiveEtablissementLayers";
import { ActiveEtablissementPopup } from "./ActiveEtablissementPopup";
import { CustomControls } from "./CustomControls";
import { EtablissementsLayers } from "./EtablissementsLayers";

interface MapProps {
  isLoading: boolean;
  etablissements: Etablissement[];
  setMap: (map: MapRef) => void;
  setBbox: (bbox: {
    latMin: number;
    lngMin: number;
    latMax: number;
    lngMax: number;
  }) => void;
  hoverUai: string | null;
  setHoverUai: (uai: string | null) => void;
  setActiveUai: (uai: string | null) => void;
  activeUai: string | null;
}

const AVAILABLE_STYLES = [
  "https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json",
  "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/standard.json",
  "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/attenue.json",
];

export const Map = ({
  isLoading,
  etablissements,
  setMap,
  setBbox,
  hoverUai,
  setHoverUai,
  setActiveUai,
  activeUai,
}: MapProps) => {
  const [style] = useState(AVAILABLE_STYLES[0]);

  if (isLoading) {
    return <Skeleton height="100%" width="100%" />;
  }

  return (
    <MapGLMap
      style={{ width: "100%", height: "100%" }}
      mapStyle={style}
      dragRotate={false}
      touchZoomRotate={false}
      maxPitch={0}
      minPitch={0}
      fadeDuration={0}
    >
      <EtablissementsLayers
        etablissements={etablissements}
        hoverUai={hoverUai}
        setHoverUai={setHoverUai}
        setActiveUai={setActiveUai}
      />
      <ActiveEtablissementLayers
        etablissements={etablissements}
        hoverUai={hoverUai}
        setActiveUai={setActiveUai}
      />
      <ActiveEtablissementPopup
        etablissements={etablissements}
        activeUai={activeUai}
        onClose={() => setActiveUai(null)}
      />
      <ScaleControl />
      <NavigationControl />
      <CustomControls setMap={setMap} setBbox={setBbox} />
    </MapGLMap>
  );
  Map;
};
