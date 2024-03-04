import { Badge, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import { ChiffresEntreeOffre } from "../../types";
import { Capacite } from "./Capacite";
import { Effectifs } from "./Effectifs";
import { PremiersVoeux } from "./PremiersVoeux";
import { TauxPression } from "./TauxPression";
import { TauxRemplissage } from "./TauxRemplissage";

export const AttractiviteSection = ({
  chiffresEntreeOffre,
}: {
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
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
            premiersVoeux={
              chiffresEntreeOffre?.[CURRENT_RENTREE]?.premiersVoeux
            }
            premiersVoeuxAnneePrecedente={
              chiffresEntreeOffre?.[
                getRentreeScolairePrecedente(CURRENT_RENTREE)
              ]?.premiersVoeux
            }
          />
        </GridItem>
        <GridItem colSpan={2}>
          <TauxPression chiffresEntreeOffre={chiffresEntreeOffre} />
        </GridItem>
      </Grid>
      <Grid templateColumns={"repeat(3, 1fr)"} gap={4}>
        <GridItem colSpan={1}>
          <Capacite
            capacite={chiffresEntreeOffre?.[CURRENT_RENTREE]?.capacite}
            effectifEntree={
              chiffresEntreeOffre?.[CURRENT_RENTREE]?.effectifEntree
            }
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Effectifs
            effectifEntree={
              chiffresEntreeOffre?.[CURRENT_RENTREE]?.effectifEntree
            }
            effectifEntreeAnneePrecedente={
              chiffresEntreeOffre?.[
                getRentreeScolairePrecedente(CURRENT_RENTREE)
              ]?.effectifEntree
            }
          />
        </GridItem>
        <GridItem colSpan={1}>
          <TauxRemplissage
            tauxRemplissage={
              chiffresEntreeOffre?.[CURRENT_RENTREE]?.tauxRemplissage
            }
            tauxRemplissageAnneePrecedente={
              chiffresEntreeOffre?.[
                getRentreeScolairePrecedente(CURRENT_RENTREE)
              ]?.tauxRemplissage
            }
          />
        </GridItem>
      </Grid>
    </>
  );
};
