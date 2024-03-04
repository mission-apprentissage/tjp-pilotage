import { Badge, Flex, Text } from "@chakra-ui/react";

import { ChiffresEntreeOffre } from "../../types";
import { NombreElevesParAnnee } from "./NombreElevesParAnnee";

export const EffectifSection = ({
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
          Nombre d'élèves par année
        </Text>
        <Badge variant="info">Rentrée 2023</Badge>
      </Flex>
      <NombreElevesParAnnee chiffresEntreeOffre={chiffresEntreeOffre} />
    </>
  );
};
