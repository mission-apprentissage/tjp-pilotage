"use client";
import { Box, Card, CardBody, HStack, useOutsideClick } from "@chakra-ui/react";
import { forwardRef, useRef } from "react";

import { InfoBlock } from "../../components/InfoBlock";
import { PanoramaFormation } from "./type";

export const FormationTooltip = forwardRef<
  HTMLDivElement,
  { formation?: PanoramaFormation; clickOutside: () => void }
>(({ formation, clickOutside, ...props }, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: cardRef,
    handler: clickOutside,
  });

  return (
    <Box zIndex={10} hidden={!formation} ref={ref} {...props}>
      <Card width={"250px"} ref={cardRef}>
        <CardBody p="4">
          <FormationTooltipContent formation={formation} />
        </CardBody>
      </Card>
    </Box>
  );
});

export const FormationTooltipContent = ({
  formation,
}: {
  formation?: PanoramaFormation;
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
        value={`${formation?.tauxInsertion12mois}%`}
      />
      <InfoBlock
        label="Tx de pousuite d'études:"
        value={`${formation?.tauxPoursuiteEtudes}%`}
      />
    </Box>
  );
};
