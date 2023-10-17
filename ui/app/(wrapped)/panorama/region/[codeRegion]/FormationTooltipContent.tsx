import { Box, HStack } from "@chakra-ui/react";

import {
  ContinuumIcon,
  ContinuumIconOutline,
} from "../../../../../components/icons/ContinuumIcon";
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
        label={
          <>
            Taux d'emploi régional:
            {formation.continuum && (
              <ContinuumIcon fontSize="16" mb="0.5" m={"1"} color="#7B61FF" />
            )}
          </>
        }
        value={`${formation?.tauxInsertion6mois}%`}
      />
      <InfoBlock
        label={
          <>
            Taux de pousuite d'études régional:
            {formation.continuum && (
              <ContinuumIcon fontSize="16" mb="0.5" m={"1"} color="#7B61FF" />
            )}
          </>
        }
        value={`${formation?.tauxPoursuiteEtudes}%`}
      />
      {formation.continuum && (
        <Box bg="#7B61FF" mt="4" color="white" p="2">
          <ContinuumIconOutline fontSize="16" mr="1" />
          Données manquantes sur cette formation, le taux affiché est celui de
          la formation historique.
        </Box>
      )}
    </Box>
  );
};
