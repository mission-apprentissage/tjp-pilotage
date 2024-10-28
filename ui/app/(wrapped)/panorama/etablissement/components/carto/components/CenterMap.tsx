import { Button, HStack, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { usePlausible } from "next-plausible";

import { useEtablissementMapContext } from "@/app/(wrapped)/panorama/etablissement/components/carto/context/etablissementMapContext";

export const CenterMap = () => {
  const { map, etablissementMap, setActiveUai, setHoverUai } = useEtablissementMapContext();
  const etablissement = etablissementMap?.etablissement;
  const trackEvent = usePlausible();

  const flyToHome = () => {
    if (etablissementMap !== undefined && map !== undefined) {
      if (etablissement !== undefined) {
        setActiveUai(etablissement.uai);
        setHoverUai(etablissement.uai);
      }

      map.flyTo({
        center: {
          lng: etablissementMap.center.lng,
          lat: etablissementMap.center.lat,
        },
        zoom: etablissementMap.initialZoom,
      });

      trackEvent("cartographie-etablissement:interaction", {
        props: {
          type: "cartographie-centrer",
        },
      });
    }
  };

  return (
    <Button variant="primary" onClick={() => flyToHome()}>
      <HStack>
        <Icon icon="ri:map-pin-line" />
        <Text>Recentrer sur l'établissement</Text>
      </HStack>
    </Button>
  );
};
