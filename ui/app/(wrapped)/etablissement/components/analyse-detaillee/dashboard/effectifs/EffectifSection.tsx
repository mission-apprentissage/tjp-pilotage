import { Text } from "@chakra-ui/react";

import { ChiffresEntree } from "../../types";
import { NombreElevesParAnnee } from "./NombreElevesParAnnee";

export const EffectifSection = ({
  chiffresEntree,
}: {
  chiffresEntree?: ChiffresEntree;
}) => {
  return (
    <>
      <Text
        fontSize={14}
        fontWeight={700}
        textTransform={"uppercase"}
        lineHeight={"24px"}
      >
        Devenir des élèves
      </Text>
      <NombreElevesParAnnee chiffresEntree={chiffresEntree} />
    </>
  );
};
