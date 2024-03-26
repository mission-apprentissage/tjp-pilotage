import "maplibre-gl/dist/maplibre-gl.css";

import { Box, Skeleton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MapGLMap, {
  NavigationControl,
  ScaleControl,
} from "react-map-gl/maplibre";

import { client } from "../../../../../../../../api.client";
import { useEtablissementMapContext } from "../../context/etablissementMapContext";
import { CustomControls } from "./components/CustomControls";
import { Etablissement } from "./components/Etablissement";
import { EtablissementsProches } from "./components/EtablissementsProches";

interface MapProps {
  uai: string;
}

const AVAILABLE_STYLES = [
  "https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json",
  "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/standard.json",
  "https://data.geopf.fr/annexes/ressources/vectorTiles/styles/PLAN.IGN/attenue.json",
];

export function Map({ uai }: MapProps) {
  const [style] = useState(AVAILABLE_STYLES[0]);
  const { etablissementMap, setEtablissementMap, cfdFilter } =
    useEtablissementMapContext();

  const { data: etablissement, isLoading } = client
    .ref("[GET]/etablissement/:uai/map")
    .useQuery({
      params: {
        uai,
      },
      query: {
        cfd: cfdFilter ? [cfdFilter] : undefined,
      },
    });

  useEffect(() => {
    if (!isLoading && etablissement) {
      setEtablissementMap(etablissement);
    }
  }, [etablissement, isLoading]);

  if (isLoading || !etablissementMap) {
    return <Skeleton height="100%" width="100%" />;
  }

  return (
    <Box height="100%" width="100%">
      <MapGLMap
        style={{ width: "100%", height: "100%" }}
        mapStyle={style}
        dragRotate={false}
        touchZoomRotate={false}
        maxPitch={0}
        minPitch={0}
      >
        <EtablissementsProches />
        <ScaleControl />
        <NavigationControl />
        <CustomControls />
        <Etablissement />
      </MapGLMap>
    </Box>
  );
}
