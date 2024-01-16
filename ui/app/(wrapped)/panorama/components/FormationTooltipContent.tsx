import { Box, HStack, Text } from "@chakra-ui/react";

import { GraphWrapper } from "@/components/GraphWrapper";

import { InfoBlock } from "../../../../components/InfoBlock";
import { PanoramaFormation } from "../types";

export const FormationTooltipContent = ({
  formation,
}: {
  formation: PanoramaFormation;
}) => {
  return (
    <Box bg="white" fontSize="xs">
      <InfoBlock
        mb="2"
        label="Formation concernée :"
        value={formation?.libelleFormation}
      />
      <InfoBlock
        mb="2"
        label="Dispositif concerné :"
        value={formation?.libelleDispositif}
      />
      <HStack mb="2" spacing={4}>
        <InfoBlock flex={1} label="Effectif :" value={formation?.effectif} />
        <InfoBlock
          flex={2}
          label="Nb Etablissements :"
          value={formation?.nbEtablissement}
        />
      </HStack>
      <InfoBlock
        mb="2"
        label="Taux de pression :"
        value={formation.tauxPression ? formation?.tauxPression : "-"}
      />
      <Text mb="1" fontWeight="medium">
        Taux d'emploi régional :
      </Text>
      <GraphWrapper
        mb="2"
        w="100%"
        continuum={formation.continuum}
        value={formation.tauxInsertion / 100}
      />
      <Text mb="1" fontWeight="medium">
        Taux de poursuite d'études régional :
      </Text>
      <GraphWrapper
        w="100%"
        continuum={formation.continuum}
        value={formation.tauxPoursuite / 100}
      />
    </Box>
  );
};
