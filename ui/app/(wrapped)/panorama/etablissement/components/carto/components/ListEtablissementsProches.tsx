import {
  HStack,
  List,
  ListItem,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import _ from "lodash";

import { client } from "../../../../../../../api.client";
import { useEtablissementContext } from "../../../context/etablissementContext";
import { useEtablissementMapContext } from "../context/etablissementMapContext";

export const ListeEtablissementsProches = () => {
  const { uai, analyseDetaillee } = useEtablissementContext();
  const { bbox } = useEtablissementMapContext();
  const cfd =
    analyseDetaillee !== undefined
      ? _.uniq(Object.values(analyseDetaillee.formations).map((f) => f.cfd))
      : [];

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
        cfd,
      },
    });

  const etablissements = data?.etablissements;

  return (
    <List overflow="auto">
      {etablissements &&
        etablissements.map((e, i) => (
          <ListItem key={e.uai + i} padding="16px">
            <VStack>
              <HStack justifyContent={"space-between"} width="100%">
                <Text fontWeight={700}>
                  {e.uai} - {e.libelleEtablissement}
                </Text>
                <Text>{e.libelleDispositif}</Text>
              </HStack>
              <HStack justifyContent={"space-between"} width="100%">
                <Text>
                  {e.commune} ({e.codeDepartement}) — {e.distance}
                </Text>
              </HStack>
            </VStack>
          </ListItem>
        ))}
      {isLoading ||
        (!etablissements && (
          <ListItem key="loading">
            <Skeleton height="20px" width="100%" />
          </ListItem>
        ))}
    </List>
  );
};
