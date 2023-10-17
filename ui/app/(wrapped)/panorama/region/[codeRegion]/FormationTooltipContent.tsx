import { Box, HStack, Text } from "@chakra-ui/react";

import { GraphWrapper } from "@/components/GraphWrapper";

import { InfoBlock } from "../../../../../components/InfoBlock";
import { PanoramaFormations } from "./type";

export const FormationTooltipContent = ({
  formation,
}: {
  formation: PanoramaFormations[number];
}) => {
  return (
    <Box bg="white" fontSize="xs">
      <InfoBlock
        mb="2"
        label="Formation concernée :"
        value={formation?.libelleDiplome}
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
        value={formation.tauxPression ? formation?.tauxPression / 100 : "-"}
      />
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
        value={formation.tauxPoursuiteEtudes}
      />
    </Box>
  );
};
