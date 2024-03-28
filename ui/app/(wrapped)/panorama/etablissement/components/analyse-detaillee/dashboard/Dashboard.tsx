import { Flex, Text } from "@chakra-ui/react";

import { BadgeTypeFamille } from "../../../../../../../components/BadgeTypeFamille";
import { BadgeVoieApprentissage } from "../../../../../../../components/BadgeVoieApprentissage";
import { ChiffresEntreeOffre, ChiffresIJOffre, Formation } from "../types";
import { AttractiviteSection } from "./attractivite/AttractiviteSection";
import { DevenirSection } from "./devenir/DevenirSection";
import { EffectifSection } from "./effectifs/EffectifSection";

export const Dashboard = ({
  formation,
  chiffresIJOffre,
  chiffresEntreeOffre,
}: {
  formation?: Formation;
  chiffresIJOffre?: ChiffresIJOffre;
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
  return (
    <Flex flexDirection={"column"} mr={8} gap={16}>
      <Flex flexDirection={"column"} gap={2} h={16}>
        <Text fontSize="18px" fontWeight={700}>
          {formation?.libelleFormation
            .replace("2nde commune", " ")
            .replace("1ere commune", " ")}
        </Text>
        <Flex direction={"row"} gap={2}>
          <BadgeTypeFamille
            typeFamille={formation?.typeFamille}
            labelSize="long"
            size={"md"}
          />
          <BadgeVoieApprentissage
            voie={formation?.voie}
            labelSize="long"
            size={"md"}
          />
        </Flex>
      </Flex>
      <DevenirSection formation={formation} chiffresIJOffre={chiffresIJOffre} />
      <AttractiviteSection
        formation={formation}
        chiffresEntreeOffre={chiffresEntreeOffre}
      />
      <EffectifSection
        formation={formation}
        chiffresEntreeOffre={chiffresEntreeOffre}
      />
    </Flex>
  );
};
