import "maplibre-gl/dist/maplibre-gl.css";

import { Box } from "@chakra-ui/react";
import { useState } from "react";
import MapGLMap, {
  NavigationControl,
  ScaleControl,
} from "react-map-gl/maplibre";

import json from "./csvjson.json";
import { Etabs } from "./Etabs";

export interface Etablissement {
  "code UAI": string;
  "n° SIRET": number;
  "type d'établissement": string;
  nom: string;
  sigle: string;
  statut: string;
  tutelle: string;
  "université de rattachement libellé": string;
  "université de rattachement ID et URL Onisep": string;
  "établissements liés libellés": string;
  "établissements liés URL et ID Onisep": string;
  "boîte postale": string;
  adresse: string;
  CP: number;
  commune: string;
  "commune (COG)": number;
  cedex: string;
  téléphone: string;
  arrondissement: string;
  département: string;
  académie: string;
  région: string;
  "région (COG)": number;
  "longitude (X)": number;
  "latitude (Y)": number;
  "journées portes ouvertes": string;
  "langues enseignées": string;
  "label génération 2024": string;
  "URL et ID Onisep": string;
}

const AVAILABLE_STYLES = [
  "https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json",
];

export function Map({ uai }: { uai?: string }) {
  const [style] = useState(AVAILABLE_STYLES[0]);
  const typedJson = json as Array<Etablissement>;

  const etabs = typedJson.slice(0, 9000);

  return (
    <Box w="100vw" h="1000px">
      <MapGLMap style={{ width: "100%", height: "100%" }} mapStyle={style}>
        <Etabs etabs={etabs} />
        <ScaleControl />
        <NavigationControl />
      </MapGLMap>
    </Box>
  );
}
