import { Box, HStack, List, ListItem, Skeleton, Text, VStack } from "@chakra-ui/react";
import { InlineIcon } from "@iconify/react";
import { createRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { client } from "@/api.client";
import { useEtablissementMapContext } from "@/app/(wrapped)/panorama/etablissement/components/carto/context/etablissementMapContext";
import { useEtablissementContext } from "@/app/(wrapped)/panorama/etablissement/context/etablissementContext";

import { CustomListItem } from "./components/CustomListItem";

export const ListeEtablissementsProches = () => {
  const { uai } = useEtablissementContext();
  const { bbox, cfdFilter, activeUai } = useEtablissementMapContext();
  const { ref: containerRef, inView } = useInView({ threshold: 0.3 });

  const { data: etablissementsList, isLoading } = client.ref("[GET]/etablissement/:uai/map/list").useQuery({
    params: {
      uai,
    },
    query: {
      bbox: {
        minLat: "" + bbox.minLat,
        maxLat: "" + bbox.maxLat,
        minLng: "" + bbox.minLng,
        maxLng: "" + bbox.maxLng,
      },
      cfd: cfdFilter ? [cfdFilter] : undefined,
    },
  });

  const etablissementsProches = etablissementsList?.etablissementsProches;

  const refs: { [key: string]: React.RefObject<HTMLDivElement> } = {};

  const initializeRefs = () => {
    if (etablissementsList) {
      if (etablissementsList?.etablissement?.uai) {
        refs[etablissementsList?.etablissement?.uai] = createRef<HTMLDivElement>();
      }

      etablissementsProches?.forEach((etablissement) => {
        refs[etablissement.uai] = createRef<HTMLDivElement>();
      });
    }
  };

  initializeRefs();

  useEffect(() => {
    if (etablissementsProches && etablissementsProches.length > 0 && refs[activeUai]?.current && inView) {
      refs[activeUai].current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [etablissementsList, activeUai]);

  return (
    <VStack width="100%" height="100%" justifyContent="start" ref={containerRef}>
      <HStack width="100%" justifyContent="space-between">
        {!etablissementsList ? (
          <Skeleton height="16px" width="50%" />
        ) : (
          <Text>
            <b>{etablissementsList?.count}</b> résultat(s) dans la zone sélectionnée
          </Text>
        )}
        <HStack>
          <Box display="inline" mr="2px">
            <InlineIcon icon="ri:sort-desc" />
          </Box>
          <Text>Tri : par distance</Text>
        </HStack>
      </HStack>
      <List flexGrow={1} overflow="auto" width="100%">
        {etablissementsProches &&
          etablissementsProches.map((e, i) => (
            <Box key={e.uai + i} ref={refs[e.uai]}>
              <CustomListItem etablissement={e} withDivider={i !== etablissementsProches.length} />
            </Box>
          ))}
        {isLoading && (
          <ListItem key="loading">
            <Skeleton height="100px" width="100%" />
          </ListItem>
        )}
      </List>
    </VStack>
  );
};
