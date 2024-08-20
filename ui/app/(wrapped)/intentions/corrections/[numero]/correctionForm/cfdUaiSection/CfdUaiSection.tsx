import {
  Badge,
  Box,
  DarkMode,
  Divider,
  Flex,
  Heading,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { CampagneStatutEnum } from "shared/enum/campagneStatutEnum";

import { client } from "@/api.client";

import { Campagne } from "../types";
import { CfdBlock } from "./CfdBlock";
import { DispositifBlock } from "./DispositifBlock";
import { LibelleFCILField } from "./LibelleFCILField";
import { UaiBlock } from "./UaiBlock";

const TagCampagne = ({ campagne }: { campagne?: Campagne }) => {
  if (!campagne) return null;
  switch (campagne.statut) {
    case CampagneStatutEnum["en cours"]:
      return (
        <Tag size="md" colorScheme={"green"} ml={4}>
          Campagne {campagne.annee} ({campagne.statut})
        </Tag>
      );
    case CampagneStatutEnum["en attente"]:
      return (
        <Tag size="md" colorScheme={"purple"} ml={4}>
          Campagne {campagne.annee} ({campagne.statut})
        </Tag>
      );
    case CampagneStatutEnum["terminée"]:
      return (
        <Tag size="md" colorScheme={"red"} ml={4}>
          Campagne {campagne.annee} ({campagne.statut})
        </Tag>
      );
    default:
      return (
        <Tag size="md" colorScheme={"yellow"} ml={4}>
          Campagne {campagne.annee} ({campagne.statut})
        </Tag>
      );
  }
};

export const CfdUaiSection = ({
  campagne,
  demande,
  isFCIL,
}: {
  campagne?: Campagne;
  demande?: (typeof client.infer)["[GET]/demande/:numero"];
  isFCIL: boolean;
}) => {
  const [uaiInfo, _setUaiInfo] = useState<
    | (typeof client.infer)["[GET]/etablissement/search/:search"][number]
    | undefined
  >(
    demande?.metadata?.etablissement?.libelleEtablissement
      ? {
          label: demande?.metadata?.etablissement.libelleEtablissement,
          value: demande?.uai ?? "",
          commune: demande?.metadata?.etablissement.commune,
        }
      : undefined
  );
  return (
    <DarkMode>
      <Box
        color="chakra-body-text"
        bg="blueecume.400_hover"
        p="6"
        borderRadius="6"
      >
        <Heading alignItems="baseline" display="flex" fontSize="2xl">
          <TagCampagne campagne={campagne} />
          <Tag size="lg" colorScheme={"red"} ml={"auto"}>
            Mode correction
          </Tag>
        </Heading>
        <Divider pt="4" mb="4" />
        <CfdBlock metadata={demande?.metadata} />
        <DispositifBlock metadata={demande?.metadata} />
        {isFCIL && <LibelleFCILField />}
        <Flex direction={"row"} justify={"space-between"}>
          <Flex direction="column" w="100%" maxW="752px">
            <Box mb="auto" w="100%" maxW="752px">
              <UaiBlock metadata={demande?.metadata} />
            </Box>
          </Flex>
          <Box
            bg="rgba(255,255,255,0.1)"
            p="4"
            flex="1"
            w="100%"
            minH={150}
            h="100%"
            ms={8}
            mt={8}
          >
            {uaiInfo && (
              <>
                <Badge mb="2" variant="success" size="sm">
                  Établissement validé
                </Badge>
                <Text fontSize="sm">{`Numéro UAI : ${uaiInfo.value}`}</Text>
                <Text fontSize="sm" mt="1">
                  {uaiInfo.label?.split("-")[0]}
                </Text>
                <Text fontSize="sm" mt="1">
                  {uaiInfo.commune}
                </Text>
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </DarkMode>
  );
};
