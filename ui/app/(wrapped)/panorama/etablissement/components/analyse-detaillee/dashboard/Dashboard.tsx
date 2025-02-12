import { Box, Flex, Heading } from "@chakra-ui/react";

import { InformationDonneeIncompletes } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/components/InformationDonneeIncompletes";
import type {
  ChiffresEntreeOffre,
  ChiffresIJOffre,
  Formation,
} from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { BadgesFormationSpecifique } from "@/components/BadgesFormationSpecifique";
import type { TypeFamilleKeys } from "@/components/BadgeTypeFamille";
import { BadgeTypeFamille } from "@/components/BadgeTypeFamille";
import { BadgeVoieApprentissage } from "@/components/BadgeVoieApprentissage";
import { GlossaireShortcut } from "@/components/GlossaireShortcut";

import { AttractiviteSection } from "./attractivite/AttractiviteSection";
import { DevenirSection } from "./devenir/DevenirSection";
import { EffectifSection } from "./effectifs/EffectifSection";

export const Dashboard = ({
  formation,
  codeRegion,
  chiffresIJOffre,
  chiffresEntreeOffre,
}: {
  codeRegion?: string;
  formation?: Formation;
  chiffresIJOffre?: ChiffresIJOffre;
  chiffresEntreeOffre?: ChiffresEntreeOffre;
}) => {
  return (
    <Flex flexDirection={"column"} mr={8} gap={16}>
      <Flex flexDirection={"column"} gap={2}>
        <Heading as="h2" fontSize={18} fontWeight={700} _firstLetter={{ textTransform: "uppercase" }}>
          {formation?.libelleFormation.replace("2nde commune", " ").replace("1ere commune", " ")}
        </Heading>
        <Flex direction={"row"} gap={2}>
          <BadgeTypeFamille typeFamille={formation?.typeFamille as TypeFamilleKeys} labelSize="long" size={"md"} />
          <Flex>
            <BadgeVoieApprentissage voie={formation?.voie} labelSize="long" size={"md"} />
            <BadgesFormationSpecifique formationSpecifique={formation?.formationSpecifique} />
            {formation?.voie === "apprentissage" && (
              <GlossaireShortcut
                ml={2}
                tooltip={
                  <Box>
                    Cette mention signale que la formation est enseignée en apprentissage sur les années civiles 2023
                    et/ou 2024.
                    <br />
                    Une formation peut apparaître "dédoublée", il s'agit alors d'une classe mixte (voie scolaire et
                    apprentissage), dont la part d'apprentis est inconnue.
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
      <AttractiviteSection formation={formation} chiffresEntreeOffre={chiffresEntreeOffre} />
      <EffectifSection chiffresEntreeOffre={chiffresEntreeOffre} />
      <InformationDonneeIncompletes
        codeRegion={codeRegion}
        formation={formation}
        chiffresIJOffre={chiffresIJOffre}
        chiffresEntreeOffre={chiffresEntreeOffre}
      />
    </Flex>
  );
};
