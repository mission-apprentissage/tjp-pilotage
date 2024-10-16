import { usePlausible } from "next-plausible";
import { useEffect } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import { useMap } from "react-map-gl/maplibre";

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

export const CustomControls = ({
  setBbox,
  setMap,
}: {
  setBbox: (bbox: { latMin: number; lngMin: number; latMax: number; lngMax: number }) => void;
  setMap: (map: MapRef) => void;
}) => {
  const { current: map } = useMap();
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
      map.on("load", async () => {
        map.off("moveend", onZoomEnd);
        map.on("moveend", onZoomEnd);
      });

      map.on("style.load", async () => {
        await Promise.all(Object.values(MAP_IMAGES).map(async (image) => await loadImageOnMap(image)));
      });

      setMap(map);
    }
  }, [map, loadImageOnMap, setMap]);

  // Lors du chargement du filtre / rechargement d'une nouvelle liste
  // useEffect(() => {
  //   if (map !== undefined) {
  //     map.off("moveend", onZoomEnd);
  //     const center = map.getCenter();
  //     const zoom = map.getZoom();
  //     map.flyTo({
  //       center,
  //       zoom,
  //       animate: false,
  //     });
  //     map.on("moveend", onZoomEnd);
  //   }
  // }, [etablissementMap]);

  const onZoomEnd = () => {
    if (map !== undefined) {
      const bounds = map.getBounds();
      setBbox({
        lngMin: bounds.toArray()[0][0],
        latMin: bounds.toArray()[0][1],
        lngMax: bounds.toArray()[1][0],
        latMax: bounds.toArray()[1][1],
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
