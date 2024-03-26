import {
  Badge,
  Box,
  Divider,
  HStack,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";

import { client } from "@/api.client";

import { themeDefinition } from "../../../../../../../../../theme/theme";

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
          <HStack width="100%" justifyContent="space-between">
            <Box>
              {etablissement.voies.map((voie) => (
                <Badge
                  key={`${etablissement.uai}-${voie}`}
                  variant={voie === "scolaire" ? "info" : "new"}
                >
                  {voie}
                </Badge>
              ))}
            </Box>
            <Box>
              {etablissement.libellesDispositifs
                .filter((libelle) => libelle !== "")
                .map((libelle, i) => (
                  <>
                    <Text
                      key={`${etablissement.uai}-${libelle}`}
                      color={themeDefinition.colors.grey[425]}
                    >
                      {libelle}
                    </Text>
                    {i < etablissement.libellesDispositifs.length - 1 && (
                      <Divider orientation="vertical" />
                    )}
                  </>
                ))}
            </Box>
          </HStack>
        </VStack>
      </ListItem>
      {withDivider && <Divider />}
    </>
  );
};
