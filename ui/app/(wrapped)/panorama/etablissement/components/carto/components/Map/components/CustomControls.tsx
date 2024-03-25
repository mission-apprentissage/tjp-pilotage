import { useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";

import { useEtablissementMapContext } from "../../../context/etablissementMapContext";

export const CustomControls = () => {
  const { current: map } = useMap();
  const { etablissementMap, setBbox, setMap } = useEtablissementMapContext();

  // Lors de l'initialisation de la carte
  useEffect(() => {
    if (map !== undefined) {
      if (etablissementMap) {
        map.setCenter({
          lng: etablissementMap.longitude,
          lat: etablissementMap.latitude,
        });
        map.setZoom(etablissementMap.initialZoom);
      }
      map.on("load", async () => {
        map.off("moveend", onZoomEnd);
        map.on("moveend", onZoomEnd);
      });
      setMap(map);
    }
  }, [map]);

  // Lors du chargement du filtre / rechargement d'un nouveau filtre
  useEffect(() => {
    if (map !== undefined) {
      if (etablissementMap) {
        map.setCenter({
          lng: etablissementMap.longitude,
          lat: etablissementMap.latitude,
        });
        map.setZoom(etablissementMap.initialZoom);
      }
      const center = map.getCenter();
      const zoom = map.getZoom();
      map.flyTo({
        center,
        zoom,
        animate: false,
      });
    }
  }, [etablissementMap]);

  const onZoomEnd = () => {
    if (map !== undefined) {
      const bounds = map.getBounds();
      setBbox({
        minLng: bounds.toArray()[0][0],
        minLat: bounds.toArray()[0][1],
        maxLng: bounds.toArray()[1][0],
        maxLat: bounds.toArray()[1][1],
      });
    }
  };

  return <></>;
};
