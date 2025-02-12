import { Badge, Flex, Grid, GridItem, Heading } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import type {
  ChiffresEntreeOffre,
  Formation,
} from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";

import { Capacite } from "./Capacite";
import { Effectifs } from "./Effectifs";
import { PremiersVoeux } from "./PremiersVoeux";
import { TauxPression } from "./TauxPression";
import { TauxRemplissage } from "./TauxRemplissage";

export const AttractiviteSection = ({
  formation,
  chiffresEntreeOffre,
}: {
  formation?: Formation;
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
  return (
    <Flex gap={4} direction={"column"}>
      <Flex direction={"row"} justifyContent={"flex-start"} gap={"8px"} alignItems={"center"}>
        <Heading as="h3" fontSize={14} fontWeight={700} textTransform={"uppercase"} lineHeight={"24px"}>
          Attractivité de la formation
        </Heading>
        <Badge variant="info" maxH={5}>
          Rentrée {CURRENT_RENTREE}
        </Badge>
      </Flex>
      <Grid templateColumns={"repeat(3, 1fr)"} gap={4}>
        <GridItem colSpan={1}>
          <PremiersVoeux
            codeNiveauDiplome={formation?.codeNiveauDiplome}
            premiersVoeux={chiffresEntreeOffre?.[CURRENT_RENTREE]?.premiersVoeux}
            premiersVoeuxAnneePrecedente={
              chiffresEntreeOffre?.[getRentreeScolairePrecedente(CURRENT_RENTREE)]?.premiersVoeux
            }
          />
        </GridItem>
        <GridItem colSpan={2}>
          <TauxPression codeNiveauDiplome={formation?.codeNiveauDiplome} chiffresEntreeOffre={chiffresEntreeOffre} />
        </GridItem>
      </Grid>
      <Grid templateColumns={"repeat(3, 1fr)"} gap={4}>
        <GridItem colSpan={1}>
          <Capacite
            capacite={chiffresEntreeOffre?.[CURRENT_RENTREE]?.capacite}
            capaciteAnneePrecedente={chiffresEntreeOffre?.[getRentreeScolairePrecedente(CURRENT_RENTREE)]?.capacite}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Effectifs
            effectifEntree={chiffresEntreeOffre?.[CURRENT_RENTREE]?.effectifEntree}
            capacite={chiffresEntreeOffre?.[CURRENT_RENTREE]?.capacite}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <TauxRemplissage
            tauxRemplissage={chiffresEntreeOffre?.[CURRENT_RENTREE]?.tauxRemplissage}
            tauxRemplissageAnneePrecedente={
              chiffresEntreeOffre?.[getRentreeScolairePrecedente(CURRENT_RENTREE)]?.tauxRemplissage
            }
          />
        </GridItem>
      </Grid>
    </Flex>
  );
};
