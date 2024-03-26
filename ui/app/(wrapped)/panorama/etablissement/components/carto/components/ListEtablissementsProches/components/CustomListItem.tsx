import {
  Badge,
  Box,
  Divider,
  HStack,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { InlineIcon } from "@iconify/react";

import { client } from "@/api.client";

import { themeDefinition } from "../../../../../../../../../theme/theme";
import { useEtablissementMapContext } from "../../../context/etablissementMapContext";

interface CustomListItemProps {
  etablissement: (typeof client.infer)["[GET]/etablissement/:uai/map/list"]["etablissementsProches"][number];
  withDivider: boolean;
  children?: React.ReactNode;
}

const formatDistance = (distance: number) => {
  return `${Math.round(distance * 10) / 10} km`;
};

const formatDispositifs = (dispositifs: string[]) => {
  return dispositifs
    .filter((libelle) => libelle !== "")
    .map((d) => {
      return d.replace(/\sen\s/i, " ").replace(/professionnel/i, "PRO");
    });
};

const formatPercentage = (percentage: number) => {
  return Math.round(percentage * 100) + "%";
};

const formatSecteur = (secteur: string) => {
  switch (secteur) {
    case "PU":
      return "Public";
    case "PR":
      return "Prive";
    default:
      return "";
  }
};

const formatDepartement = (departement: string) => {
  if (departement.length === 3 && departement[0] === "0") {
    return departement.substring(1);
  }

  return departement;
};

export const CustomListItem = ({
  etablissement,
  withDivider,
  children,
}: CustomListItemProps) => {
  const { activeUai, setActiveUai } = useEtablissementMapContext();

  if (!etablissement) return null;

  return (
    <>
      <ListItem
        padding="16px"
        _hover={{
          backgroundColor: themeDefinition.colors.grey["1000_hover"],
          cursor: "pointer",
        }}
        backgroundColor={
          activeUai === etablissement.uai
            ? themeDefinition.colors.grey["1000_active"]
            : "transparent"
        }
        onClick={() => setActiveUai(etablissement.uai)}
      >
        <VStack>
          <HStack justifyContent={"space-between"} width="100%">
            <Text fontWeight={700}>
              {etablissement.libelleEtablissement.split(" - ")[0]}
            </Text>
            <HStack flexWrap="wrap" justifyContent="flex-end">
              {formatDispositifs(etablissement.libellesDispositifs).map(
                (libelle) => (
                  <Badge
                    key={`${etablissement.uai}-${libelle}`}
                    variant="neutral"
                  >
                    {libelle}
                  </Badge>
                )
              )}
              {children}
            </HStack>
          </HStack>
          <HStack justifyContent={"space-between"} width="100%">
            <HStack
              fontSize="12px"
              color={themeDefinition.colors.grey[425]}
              divider={<Divider orientation="vertical" h="12px" w="1px" />}
            >
              <Text>
                {etablissement.commune} (
                {formatDepartement(etablissement.codeDepartement)})
              </Text>
              <Text>{formatDistance(etablissement.distance)}</Text>
              {etablissement.secteur && (
                <Text>{formatSecteur(etablissement.secteur)}</Text>
              )}
            </HStack>
          </HStack>
          <HStack width="100%" justifyContent="space-between">
            <HStack width="100%" justifyContent="space-between">
              <HStack gap="8px">
                {etablissement.voies.map((voie) =>
                  voie === "scolaire" ? (
                    <Badge variant="info" key={`${etablissement.uai}-${voie}`}>
                      <Box display="inline" mr="4px">
                        <InlineIcon
                          icon="ri:briefcase-5-line"
                          color={themeDefinition.colors.info.text}
                        />
                      </Box>
                      {voie}
                    </Badge>
                  ) : (
                    <Badge variant="new" key={`${etablissement.uai}-${voie}`}>
                      <Box display="inline" mr="4px">
                        <InlineIcon
                          icon="ri:hotel-line"
                          color={themeDefinition.colors.orange.dark}
                        />
                      </Box>
                      {voie}
                    </Badge>
                  )
                )}
              </HStack>
              <HStack
                gap="8px"
                fontSize="12px"
                divider={<Divider h="12px" w="1px" orientation="vertical" />}
                color={themeDefinition.colors.grey[425]}
              >
                {etablissement.effectif !== undefined && (
                  <HStack gap="4px">
                    <InlineIcon icon="ri:group-line" />
                    <Text>{etablissement.effectif}</Text>
                  </HStack>
                )}
                {etablissement.tauxInsertion !== undefined && (
                  <HStack gap="4px">
                    <InlineIcon icon="ri:briefcase-line" />
                    <Text>{formatPercentage(etablissement.tauxInsertion)}</Text>
                  </HStack>
                )}
                {etablissement.tauxPoursuite !== undefined && (
                  <HStack gap="4px">
                    <InlineIcon icon="ri:book-open-line" />
                    <Text>{formatPercentage(etablissement.tauxPoursuite)}</Text>
                  </HStack>
                )}
              </HStack>
            </HStack>
          </HStack>
        </VStack>
      </ListItem>
      {withDivider && <Divider />}
    </>
  );
};
