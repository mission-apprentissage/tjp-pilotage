"use client";
import { Box, Card, CardBody, useOutsideClick } from "@chakra-ui/react";
import { forwardRef, useRef } from "react";
import { ApiType } from "shared";

import { api } from "../../../../api.client";
import { InfoBlock } from "../../../../components/InfoBlock";

export const FormationTooltip = forwardRef<
  HTMLDivElement,
  {
    formation?: ApiType<typeof api.getEtablissement>["formations"][number];
    clickOutside: () => void;
  }
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
  formation?: ApiType<typeof api.getEtablissement>["formations"][number];
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
