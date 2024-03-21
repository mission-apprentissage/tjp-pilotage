import { useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";

import { useEtablissementMapContext } from "../../../context/etablissementMapContext";

export const CustomControls = () => {
  const { current: map } = useMap();
  const { setBbox } = useEtablissementMapContext();

  useEffect(() => {
    if (map !== undefined) {
      map.on("load", async () => {
        map.off("moveend", onZoomEnd);
        map.on("moveend", onZoomEnd);
      });
    }
  }, [map]);

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
