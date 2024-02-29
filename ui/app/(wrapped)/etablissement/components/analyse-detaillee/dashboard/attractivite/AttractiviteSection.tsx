import { Grid, GridItem, Text } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";

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
      <Text
        fontSize={14}
        fontWeight={700}
        textTransform={"uppercase"}
        lineHeight={"24px"}
      >
        Attractivité de la formation
      </Text>
      <Grid
        templateRows={"repeat(2, 1fr)"}
        templateColumns={"repeat(3, 1fr)"}
        gap={4}
      >
        <GridItem colSpan={1}>
          <PremiersVoeux
            premiersVoeux={chiffresEntree?.[CURRENT_RENTREE]?.premiersVoeux}
          />
        </GridItem>
        <GridItem colSpan={2} h={300}>
          <TauxPression chiffresEntree={chiffresEntree} />
        </GridItem>
        <GridItem colSpan={1}>
          <Capacite
            capacite={chiffresEntree?.[CURRENT_RENTREE]?.capacite}
            effectifEntree={chiffresEntree?.[CURRENT_RENTREE]?.effectifEntree}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Effectifs
            effectifEntree={chiffresEntree?.[CURRENT_RENTREE]?.effectifEntree}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <TauxRemplissage
            tauxRemplissage={chiffresEntree?.[CURRENT_RENTREE]?.tauxRemplissage}
          />
        </GridItem>
      </Grid>
    </>
  );
};
