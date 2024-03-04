import { Badge, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { ChiffresEntree } from "../../types";
import { Capacite } from "./Capacite";
import { Effectifs } from "./Effectifs";
import { PremiersVoeux } from "./PremiersVoeux";
import { TauxPression } from "./TauxPression";
import { TauxRemplissage } from "./TauxRemplissage";

export const AttractiviteSection = ({
  chiffresEntree,
}: {
  chiffresEntree?: ChiffresEntree;
}) => {
  console.log(chiffresEntree);
  return (
    <>
      <Flex direction={"row"} justifyContent={"space-between"}>
        <Text
          fontSize={14}
          fontWeight={700}
          textTransform={"uppercase"}
          lineHeight={"24px"}
        >
          Attractivité de la formation
        </Text>
        <Badge variant="info">Rentrée 2023</Badge>
      </Flex>
      <Grid templateColumns={"repeat(3, 1fr)"} gap={4}>
        <GridItem colSpan={1}>
          <PremiersVoeux
            premiersVoeux={chiffresEntree?.[CURRENT_RENTREE]?.premiersVoeux}
            premiersVoeuxAnneePrecedente={
              chiffresEntree?.[getRentreeScolairePrecedente(CURRENT_RENTREE)]
                ?.premiersVoeux
            }
          />
        </GridItem>
        <GridItem colSpan={2}>
          <TauxPression chiffresEntree={chiffresEntree} />
        </GridItem>
      </Grid>
      <Grid templateColumns={"repeat(3, 1fr)"} gap={4}>
        <GridItem colSpan={1}>
          <Capacite
            capacite={chiffresEntree?.[CURRENT_RENTREE]?.capacite}
            effectifEntree={chiffresEntree?.[CURRENT_RENTREE]?.effectifEntree}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Effectifs
            effectifEntree={chiffresEntree?.[CURRENT_RENTREE]?.effectifEntree}
            effectifEntreeAnneePrecedente={
              chiffresEntree?.[getRentreeScolairePrecedente(CURRENT_RENTREE)]
                ?.effectifEntree
            }
          />
        </GridItem>
        <GridItem colSpan={1}>
          <TauxRemplissage
            tauxRemplissage={chiffresEntree?.[CURRENT_RENTREE]?.tauxRemplissage}
            tauxRemplissageAnneePrecedente={
              chiffresEntree?.[getRentreeScolairePrecedente(CURRENT_RENTREE)]
                ?.tauxRemplissage
            }
          />
        </GridItem>
      </Grid>
    </>
  );
};
