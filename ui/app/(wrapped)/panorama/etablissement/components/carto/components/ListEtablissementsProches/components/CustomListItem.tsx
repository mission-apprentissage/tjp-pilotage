import {
  Badge,
  Divider,
  HStack,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";

import { client } from "@/api.client";

interface CustomListItemProps {
  etablissement: (typeof client.infer)["[GET]/etablissement/:uai/map"]["etablissementsProches"][number];
  withDivider: boolean;
  children?: React.ReactNode;
}

const formatDistance = (distance: number) => {
  return Math.round(distance * 10) / 10;
};

export const CustomListItem = ({
  etablissement,
  withDivider,
  children,
}: CustomListItemProps) => {
  return (
    <>
      <ListItem padding="16px">
        <VStack>
          <HStack justifyContent={"space-between"} width="100%">
            <Text fontWeight={700}>
              {etablissement.uai} -{" "}
              {etablissement.libelleEtablissement.split(" - ")[0]}
            </Text>
            {children}
          </HStack>
          <HStack justifyContent={"space-between"} width="100%">
            <Text>
              {etablissement.commune} ({etablissement.codeDepartement}) —{" "}
              {formatDistance(etablissement.distance)}km
            </Text>
          </HStack>
          <HStack width="100%">
            {etablissement.libellesDispositifs
              .filter((l) => l !== "")
              .map((l) => (
                <Badge key={`${etablissement.uai}-${l}`} variant="">
                  {l}
                </Badge>
              ))}
            {etablissement.voies.map((v) => (
              <Badge
                key={`${etablissement.uai}-${v}`}
                variant={v === "scolaire" ? "info" : "new"}
              >
                {v}
              </Badge>
            ))}
          </HStack>
        </VStack>
      </ListItem>
      {withDivider && <Divider />}
    </>
  );
};
