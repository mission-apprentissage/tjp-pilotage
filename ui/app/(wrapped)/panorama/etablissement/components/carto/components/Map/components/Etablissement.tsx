import { useEffect } from "react";
import { Marker, useMap } from "react-map-gl/maplibre";

import { useEtablissementMapContext } from "../../../context/etablissementMapContext";

export const Etablissement = () => {
  const { current: map } = useMap();
  const { etablissementMap } = useEtablissementMapContext();

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

  return etablissementMap ? (
    <Marker
      longitude={etablissementMap.longitude}
      latitude={etablissementMap.latitude}
    />
  ) : (
    <></>
  );
};
