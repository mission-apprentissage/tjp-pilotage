import { WarningTwoIcon } from "@chakra-ui/icons";
import { Badge, Flex, Text } from "@chakra-ui/react";
import { CURRENT_RENTREE } from "shared";

import { ChiffresEntreeOffre } from "../../types";
import { NombreElevesParAnnee } from "./NombreElevesParAnnee";

const isAnyDataMissing = (chiffresEntreeOffre?: ChiffresEntreeOffre) =>
  !chiffresEntreeOffre ||
  typeof chiffresEntreeOffre.effectifAnnee1 === "undefined" ||
  typeof chiffresEntreeOffre.effectifAnnee2 === "undefined" ||
  typeof chiffresEntreeOffre.effectifAnnee3 === "undefined";

export const EffectifSection = ({
  chiffresEntreeOffre,
}: {
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
  return (
    <>
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
          Nombre d'élèves par année
        </Text>
        <Badge variant="info" maxH={5}>
          Rentrée {CURRENT_RENTREE}
        </Badge>
        {isAnyDataMissing(chiffresEntreeOffre) && (
          <Badge variant="warning" maxH={5}>
            <WarningTwoIcon me={2} />
            Données incomplètes
          </Badge>
        )}
      </Flex>
      <NombreElevesParAnnee chiffresEntreeOffre={chiffresEntreeOffre} />
    </>
  );
};
