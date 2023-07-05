import { Box, HStack } from "@chakra-ui/react";

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
        label="Formation concernée:"
        value={formation?.libelleDiplome}
      />
      <InfoBlock
        mb="2"
        label="Dispositif concerné:"
        value={formation?.libelleDispositif}
      />
      <HStack mb="2" spacing={4}>
        <InfoBlock flex={1} label="Effectif:" value={formation?.effectif} />
        <InfoBlock
          flex={2}
          label="Nb Etablissements:"
          value={formation?.nbEtablissement}
        />
      </HStack>
      <InfoBlock
        mb="2"
        label="Tx de pression:"
        value={formation?.tauxPression ? formation?.tauxPression / 100 : "-"}
      />
      <InfoBlock
        mb="2"
        label="Tx d'emploi:"
        value={`${formation?.tauxInsertion6mois}%`}
      />
      <InfoBlock
        label="Tx de pousuite d'études:"
        value={`${formation?.tauxPoursuiteEtudes}%`}
      />
    </Box>
  );
};
