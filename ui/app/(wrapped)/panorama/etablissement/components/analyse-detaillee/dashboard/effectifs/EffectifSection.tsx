import { WarningTwoIcon } from "@chakra-ui/icons";
import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";

import {
  ChiffresEntreeOffre,
  ChiffresEntreeOffreRentree,
  Formation,
} from "../../types";
import { NombreElevesParAnnee } from "./NombreElevesParAnnee";

const isAnyDataMissing = (
  formation?: Formation,
  chiffresEntreeOffre?: ChiffresEntreeOffreRentree
) => {
  if (!formation || !chiffresEntreeOffre) {
    return true;
  }

  if (formation.typeFamille === "2nde_commune") {
    return typeof chiffresEntreeOffre.effectifAnnee1 === "undefined";
  }

  if (formation.typeFamille === "1ere_commune") {
    return typeof chiffresEntreeOffre.effectifAnnee1 === "undefined";
  }

  if (formation.typeFamille === "specialite") {
    if (chiffresEntreeOffre.dateOuverture - Number(CURRENT_RENTREE) === 0) {
      return typeof chiffresEntreeOffre.effectifAnnee2 === "undefined";
    }

    return (
      typeof chiffresEntreeOffre.effectifAnnee2 === "undefined" ||
      typeof chiffresEntreeOffre.effectifAnnee3 === "undefined"
    );
  }

  if (formation.typeFamille === "option") {
    return typeof chiffresEntreeOffre.effectifAnnee2 === "undefined";
  }

  if (chiffresEntreeOffre.dateOuverture - Number(CURRENT_RENTREE) === 0) {
    return typeof chiffresEntreeOffre.effectifAnnee1 === "undefined";
  }

  if (
    Math.abs(chiffresEntreeOffre.dateOuverture - Number(CURRENT_RENTREE)) === 1
  ) {
    if ((chiffresEntreeOffre.effectifs ?? []).length >= 2) {
      return (
        typeof chiffresEntreeOffre.effectifAnnee2 === "undefined" &&
        typeof chiffresEntreeOffre.effectifAnnee1 === "undefined"
      );
    } else {
      return typeof chiffresEntreeOffre.effectifAnnee1 === "undefined";
    }
  }

  return chiffresEntreeOffre.effectifs?.some((f) => f === null);
};

export const EffectifSection = ({
  formation,
  chiffresEntreeOffre,
}: {
  formation?: Formation;
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
  console.debug("EffectifSection", { formation, chiffresEntreeOffre });
  return (
    <Box>
      <Flex
        direction={"row"}
        justifyContent={"flex-start"}
        gap={"8px"}
        alignItems={"center"}
        mb={4}
      >
        <Text
          fontSize={14}
          fontWeight={700}
          textTransform={"uppercase"}
          lineHeight={"24px"}
        >
          Nombre d'élèves par année
        </Text>
        <Badge variant="info" maxH={5}>
          Rentrée {CURRENT_RENTREE}
        </Badge>
        {isAnyDataMissing(
          formation,
          chiffresEntreeOffre?.[CURRENT_RENTREE]
        ) && (
          <Badge variant="grey" maxH={5}>
            <WarningTwoIcon me={2} />
            Données incomplètes
          </Badge>
        )}
      </Flex>
      <NombreElevesParAnnee chiffresEntreeOffre={chiffresEntreeOffre} />
    </Box>
  );
};
