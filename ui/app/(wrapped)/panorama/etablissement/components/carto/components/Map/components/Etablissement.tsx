import { useEffect } from "react";
import { Marker, useMap } from "react-map-gl/maplibre";

import { client } from "../../../../../../../../../api.client";
import { useEtablissementContext } from "../../../../../context/etablissementContext";

interface EtablissementProps {
  etablissement: (typeof client.infer)["[GET]/etablissement/:uai/map"];
}

export const Etablissement = ({ etablissement }: EtablissementProps) => {
  const { current: map } = useMap();
  const { etablissementMap } = useEtablissementContext();

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

  return (
    <Marker
      longitude={etablissement.longitude}
      latitude={etablissement.latitude}
    />
  );
};
