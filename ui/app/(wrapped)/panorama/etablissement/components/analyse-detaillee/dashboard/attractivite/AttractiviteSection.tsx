import { WarningTwoIcon } from "@chakra-ui/icons";
import { Badge, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";
import { getRentreeScolairePrecedente } from "shared/utils/getRentreeScolaire";

import {
  ChiffresEntreeOffre,
  ChiffresEntreeOffreRentree,
  Formation,
} from "../../types";
import { Capacite } from "./Capacite";
import { Effectifs } from "./Effectifs";
import { PremiersVoeux } from "./PremiersVoeux";
import { TauxPression } from "./TauxPression";
import { TauxRemplissage } from "./TauxRemplissage";

const isAnyDataMissing = (chiffresEntreeOffre?: ChiffresEntreeOffreRentree) =>
  !chiffresEntreeOffre ||
  typeof chiffresEntreeOffre.premiersVoeux === "undefined" ||
  typeof chiffresEntreeOffre.tauxPression === "undefined" ||
  typeof chiffresEntreeOffre.effectifs === "undefined" ||
  typeof chiffresEntreeOffre.capacite === "undefined" ||
  typeof chiffresEntreeOffre.tauxPressionDepartemental === "undefined" ||
  typeof chiffresEntreeOffre.tauxPressionRegional === "undefined" ||
  typeof chiffresEntreeOffre.tauxPressionNational === "undefined" ||
  typeof chiffresEntreeOffre.tauxRemplissage === "undefined";

export const AttractiviteSection = ({
  formation,
  chiffresEntreeOffre,
}: {
  formation?: Formation;
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
  return (
    <Flex gap={4} direction={"column"}>
      <Flex
        direction={"row"}
        justifyContent={"flex-start"}
        gap={"8px"}
        alignItems={"center"}
      >
        <Text
          fontSize={14}
          fontWeight={700}
          textTransform={"uppercase"}
          lineHeight={"24px"}
        >
          Attractivité de la formation
        </Text>
        <Badge variant="info" maxH={5}>
          Rentrée {CURRENT_RENTREE}
        </Badge>
        {isAnyDataMissing(chiffresEntreeOffre?.[CURRENT_RENTREE]) && (
          <Badge variant="grey" maxH={5}>
            <WarningTwoIcon me={2} />
            Données incomplètes
          </Badge>
        )}
      </Flex>
      <Grid templateColumns={"repeat(3, 1fr)"} gap={4}>
        <GridItem colSpan={1}>
          <PremiersVoeux
            codeNiveauDiplome={formation?.codeNiveauDiplome}
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
          <TauxPression
            codeNiveauDiplome={formation?.codeNiveauDiplome}
            chiffresEntreeOffre={chiffresEntreeOffre}
          />
        </GridItem>
      </Grid>
      <Grid templateColumns={"repeat(3, 1fr)"} gap={4}>
        <GridItem colSpan={1}>
          <Capacite
            capacite={chiffresEntreeOffre?.[CURRENT_RENTREE]?.capacite}
            capaciteAnneePrecedente={
              chiffresEntreeOffre?.[
                getRentreeScolairePrecedente(CURRENT_RENTREE)
              ]?.capacite
            }
          />
        </GridItem>
        <GridItem colSpan={1}>
          <Effectifs
            effectifEntree={
              chiffresEntreeOffre?.[CURRENT_RENTREE]?.effectifEntree
            }
            capacite={chiffresEntreeOffre?.[CURRENT_RENTREE]?.capacite}
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
    </Flex>
  );
};
