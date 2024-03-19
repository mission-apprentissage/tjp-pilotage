"use client";
import { Box, Text } from "@chakra-ui/react";

import { GraphWrapper } from "@/components/GraphWrapper";

import { InfoBlock } from "../../../../../../components/InfoBlock";
import { PanoramaFormationEtablissement } from "../../../types";

export const FormationTooltipContent = ({
  formation,
}: {
  formation: PanoramaFormationEtablissement;
}) => (
  <Box bg="white" fontSize="xs">
    <InfoBlock
      mb="2"
      label="Formation concernée:"
      value={formation.libelleFormation}
    />
    <InfoBlock
      mb="2"
      label="Dispositif concerné:"
      value={formation.libelleDispositif}
    />
    <InfoBlock
      mb="2"
      label="Effectif de l'établissement:"
      value={formation.effectif ?? "-"}
    />
    <InfoBlock
      mb="2"
      label="Taux de pression de l'établissement:"
      value={formation.tauxPression ? formation?.tauxPression : "-"}
    />
    <Text mb="1" fontWeight="medium">
      Taux d'emploi régional :
    </Text>
    <GraphWrapper
      mb="2"
      w="100%"
      continuum={formation.continuum}
      value={formation.tauxInsertion}
    />
    <Text mb="1" fontWeight="medium">
      Taux de poursuite d'études régional :
    </Text>
    <GraphWrapper
      w="100%"
      continuum={formation.continuum}
      value={formation.tauxPoursuite}
    />
  </Box>
);