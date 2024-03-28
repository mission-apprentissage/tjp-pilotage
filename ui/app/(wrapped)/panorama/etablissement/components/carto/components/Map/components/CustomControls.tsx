import { useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";

import { useEtablissementMapContext } from "../../../context/etablissementMapContext";

export const MAP_IMAGES = {
  MAP_POINT_APPRENTISSAGE: {
    path: "/map/map_point_apprentissage.png",
    name: "map_point_apprentissage",
  },
  MAP_POINT_APPRENTISSAGE_INVERTED: {
    path: "/map/map_point_apprentissage_inverted.png",
    name: "map_point_apprentissage_inverted",
  },
  MAP_POINT_SCOLAIRE_APPRENTISSAGE: {
    path: "/map/map_point_scolaire_apprentissage.png",
    name: "map_point_scolaire_apprentissage",
  },
  MAP_POINT_SCOLAIRE_APPRENTISSAGE_INVERTED: {
    path: "/map/map_point_scolaire_apprentissage_inverted.png",
    name: "map_point_scolaire_apprentissage_inverted",
  },
  MAP_POINT_SCOLAIRE: {
    path: "/map/map_point_scolaire.png",
    name: "map_point_scolaire",
  },
  MAP_POINT_SCOLAIRE_INVERTED: {
    path: "/map/map_point_scolaire_inverted.png",
    name: "map_point_scolaire_inverted",
  },
};

export const CustomControls = () => {
  const { current: map } = useMap();
  const { etablissementMap, setBbox, setMap } = useEtablissementMapContext();

  const loadImageOnMap = async (image: { path: string; name: string }) => {
    if (map !== undefined && map.isStyleLoaded()) {
      const loadedImage = await map.loadImage(image.path);
      if (map.hasImage(image.name)) {
        map.updateImage(image.name, loadedImage.data);
      } else {
        map.addImage(image.name, loadedImage.data);
      }
    }
  };

  // Lors de l'initialisation de la carte
  useEffect(() => {
    if (map !== undefined) {
      if (etablissementMap !== undefined) {
        map.setCenter({
          lng: etablissementMap.center.lng,
          lat: etablissementMap.center.lat,
        });
        map.setZoom(etablissementMap.initialZoom);
      }

      map.on("load", async () => {
        await Promise.all(
          Object.values(MAP_IMAGES).map(
            async (image) => await loadImageOnMap(image)
          )
        );

        map.off("moveend", onZoomEnd);
        map.on("moveend", onZoomEnd);
      });
      setMap(map);
    }
  }, [map]);

  // Lors du chargement du filtre / rechargement d'une nouvelle liste
  useEffect(() => {
    if (map !== undefined) {
      if (etablissementMap !== undefined) {
        map.setCenter({
          lng: etablissementMap.center.lng,
          lat: etablissementMap.center.lat,
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
