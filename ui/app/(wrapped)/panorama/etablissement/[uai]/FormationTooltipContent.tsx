"use client";
import { Box, Text } from "@chakra-ui/react";
import { ApiType } from "shared";

import { GraphWrapper } from "@/components/GraphWrapper";

import { api } from "../../../../../api.client";
import { InfoBlock } from "../../../../../components/InfoBlock";

export const FormationTooltipContent = ({
  formation,
}: {
  formation: ApiType<typeof api.getEtablissement>["formations"][number];
}) => (
  <Box bg="white" fontSize="xs">
    <InfoBlock
      mb="2"
      label="Formation concernée:"
      value={formation.libelleDiplome}
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
    <Text mb="1" fontWeight="medium">
      Taux de pression :
    </Text>
    <GraphWrapper mb="2" w="100%" value={formation.tauxPression} />
    <Text mb="1" fontWeight="medium">
      Taux d'emploi régional :
    </Text>
    <GraphWrapper
      mb="2"
      w="100%"
      continuum={formation.continuum}
      value={formation.tauxInsertion6mois}
    />
    <Text mb="1" fontWeight="medium">
      Taux de pousuite d'études régional :
    </Text>
    <GraphWrapper
      w="100%"
      continuum={formation.continuum}
      value={formation.tauxInsertion6mois}
    />
  </Box>
);
