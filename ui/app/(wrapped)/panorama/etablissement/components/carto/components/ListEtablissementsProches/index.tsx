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

import { client } from "../../../../../../../../api.client";
import { useEtablissementContext } from "../../../../context/etablissementContext";
import { useEtablissementMapContext } from "../../context/etablissementMapContext";
import { CustomListItem } from "./components/CustomListItem";

export const ListeEtablissementsProches = () => {
  const { uai } = useEtablissementContext();
  const { bbox, etablissementMap, map, cfdFilter } =
    useEtablissementMapContext();

  const { data, isLoading } = client
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

  const centerOnEtablissement = () => {
    if (map && etablissementMap) {
      map.flyTo({
        center: [etablissementMap.longitude, etablissementMap.latitude],
        zoom: etablissementMap.initialZoom,
      });
    }
  };

  const etablissementsProches = data?.etablissementsProches;

  return (
    <VStack width="100%" height="100%" justifyContent="start">
      <HStack width="100%" justifyContent="space-between">
        {!data ? (
          <Skeleton height="16px" width="50%" />
        ) : (
          <Text>
            <b>{data?.count}</b> résultat(s) dans la zone sélectionnée
          </Text>
        )}
        <HStack>
          <Box display="inline" mr="2px">
            <InlineIcon icon="ri:sort-desc" />
          </Box>
          <Text>Tri : par distance</Text>
        </HStack>
      </HStack>
      <List flexGrow={1} overflow="auto">
        {etablissementMap && (
          <CustomListItem
            withDivider
            etablissement={_.omit(
              etablissementMap,
              "initialZoom",
              "etablissementsProches"
            )}
          >
            <Button variant="primary" onClick={() => centerOnEtablissement()}>
              <HStack gap="4px">
                <Icon icon="ri:map-pin-line"></Icon>
                <Text>Recentrer</Text>
              </HStack>
            </Button>
          </CustomListItem>
        )}
        {etablissementsProches &&
          etablissementsProches.map((e, i) => (
            <CustomListItem
              etablissement={e}
              key={e.uai + i}
              withDivider={i !== etablissementsProches.length}
            />
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
