import {
  Box,
  Button,
  HStack,
  List,
  ListItem,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Icon, InlineIcon } from "@iconify/react";
import _ from "lodash";
import { createRef, useEffect } from "react";

import { client } from "../../../../../../../../api.client";
import { useEtablissementContext } from "../../../../context/etablissementContext";
import { useEtablissementMapContext } from "../../context/etablissementMapContext";
import { CustomListItem } from "./components/CustomListItem";

export const ListeEtablissementsProches = () => {
  const { uai } = useEtablissementContext();
  const { bbox, etablissementMap, map, cfdFilter, activeUai } =
    useEtablissementMapContext();

  const { data: etablissementsList, isLoading } = client
    .ref("[GET]/etablissement/:uai/map/list")
    .useQuery({
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

  const flyToEtablissement = () => {
    if (map && etablissementMap) {
      map.flyTo({
        center: [etablissementMap.longitude, etablissementMap.latitude],
        zoom: etablissementMap.initialZoom,
      });
    }
  };

  const etablissementsProches = etablissementsList?.etablissementsProches;

  const refs: { [key: string]: React.RefObject<HTMLDivElement> } = {};

  const initializeRefs = () => {
    if (etablissementsList) {
      if (etablissementsList?.uai) {
        refs[etablissementsList?.uai] = createRef<HTMLDivElement>();
      }

      etablissementsProches?.forEach((etablissement) => {
        refs[etablissement.uai] = createRef<HTMLDivElement>();
      });
    }
  };

  initializeRefs();

  useEffect(() => {
    console.log(refs);
    console.log(activeUai);
    console.log(refs[activeUai]?.current);
    if (
      etablissementsProches &&
      etablissementsProches.length > 0 &&
      refs[activeUai]?.current
    ) {
      refs[activeUai].current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [etablissementsList, activeUai]);

  return (
    <VStack width="100%" height="100%" justifyContent="start">
      <HStack width="100%" justifyContent="space-between">
        {!etablissementsList ? (
          <Skeleton height="16px" width="50%" />
        ) : (
          <Text>
            <b>{etablissementsList?.count}</b> résultat(s) dans la zone
            sélectionnée
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
        {etablissementsList && (
          <Box ref={refs[etablissementsList.uai]}>
            <CustomListItem
              withDivider
              etablissement={_.omit(
                etablissementsList,
                "count",
                "etablissementsProches"
              )}
            >
              <Button variant="primary" onClick={() => flyToEtablissement()}>
                <HStack gap="4px">
                  <Icon icon="ri:map-pin-line"></Icon>
                  <Text>Recentrer</Text>
                </HStack>
              </Button>
            </CustomListItem>
          </Box>
        )}
        {etablissementsProches &&
          etablissementsProches.map((e, i) => (
            <Box key={e.uai + i} ref={refs[e.uai]}>
              <CustomListItem
                etablissement={e}
                withDivider={i !== etablissementsProches.length}
              />
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
