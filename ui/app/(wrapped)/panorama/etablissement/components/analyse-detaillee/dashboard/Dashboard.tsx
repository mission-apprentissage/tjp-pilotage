import { Box, Flex, Text } from "@chakra-ui/react";

import {
  BadgeTypeFamille,
  TypeFamilleKeys,
} from "../../../../../../../components/BadgeTypeFamille";
import { BadgeVoieApprentissage } from "../../../../../../../components/BadgeVoieApprentissage";
import { GlossaireShortcut } from "../../../../../../../components/GlossaireShortcut";
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
            typeFamille={formation?.typeFamille as TypeFamilleKeys}
            labelSize="long"
            size={"md"}
          />
          <Flex>
            <BadgeVoieApprentissage
              voie={formation?.voie}
              labelSize="long"
              size={"md"}
            />
            {formation?.voie === "apprentissage" && (
              <GlossaireShortcut
                ml={2}
                maxWidthTooltip={300}
                tooltip={
                  <Box>
                    Cette mention signale que la formation est enseignée en
                    apprentissage sur les années civiles 2023 et/ou 2024.
                    <br />
                    Une formation peut apparaître "dédoublée", il s'agit alors
                    d'une classe mixte (voie scolaire et apprentissage), dont la
                    part d'apprentis est inconnue.
                    <br />
                    <br />
                    Cliquez pour plus d'infos.
                  </Box>
                }
              />
            )}
          </Flex>
        </Flex>
      </Flex>
      <DevenirSection chiffresIJOffre={chiffresIJOffre} />
      <AttractiviteSection
        formation={formation}
        chiffresEntreeOffre={chiffresEntreeOffre}
      />
      <EffectifSection chiffresEntreeOffre={chiffresEntreeOffre} />
    </Flex>
  );
};
