import { usePlausible } from "next-plausible";
import { useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";

import { useEtablissementMapContext } from "@/app/(wrapped)/panorama/etablissement/components/carto/context/etablissementMapContext";

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
  const trackEvent = usePlausible();

  const loadImageOnMap = async (image: { path: string; name: string }) => {
    if (!map?.isStyleLoaded()) {
      setTimeout(async () => loadImageOnMap(image), 200);
    } else {
      const loadedImage = await map.loadImage(image.path);
      // Ensure getImage is accessible because race condition might trigger a user error
      if (map?.getImage !== undefined && map.hasImage(image.name)) {
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
        map.off("moveend", onZoomEnd);
        map.on("moveend", onZoomEnd);
      });

      map.on("style.load", async () => {
        await Promise.all(Object.values(MAP_IMAGES).map(async (image) => await loadImageOnMap(image)));
      });

      setMap(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // Lors du chargement du filtre / rechargement d'une nouvelle liste
  useEffect(() => {
    if (map !== undefined) {
      map.off("moveend", onZoomEnd);
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
      map.on("moveend", onZoomEnd);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      trackEvent("cartographie-etablissement:interaction", {
        props: {
          type: "cartographie-zoom",
        },
      });
    }
  };

  return <></>;
};
