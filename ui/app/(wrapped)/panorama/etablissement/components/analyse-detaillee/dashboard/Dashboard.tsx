import { WarningTwoIcon } from "@chakra-ui/icons";
import { Badge, Flex, Text } from "@chakra-ui/react";

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
  const checkDataAvailability = () =>
    chiffresIJOffre &&
    chiffresEntreeOffre &&
    Object.values(chiffresEntreeOffre).findIndex(
      (value) =>
        value.tauxPression &&
        value.tauxPressionNational &&
        value.tauxPressionRegional &&
        value.tauxPressionDepartemental &&
        value.premiersVoeux &&
        value.effectifEntree &&
        value.capacite &&
        value.tauxRemplissage
    ) !== -1 &&
    Object.values(chiffresIJOffre).findIndex(
      (value) =>
        value.nbSortants &&
        value.nbPoursuiteEtudes &&
        value.nbInsertion6mois &&
        value.effectifSortie &&
        value.tauxDevenirFavorable &&
        value.tauxInsertion &&
        value.tauxPoursuite
    ) !== -1;

  return (
    <Flex flexDirection={"column"} mr={8} gap={8}>
      <Flex flexDirection={"column"} gap={2}>
        <Text fontSize="18px" fontWeight={700}>
          {formation?.libelleFormation
            .replace("2nde commune", " ")
            .replace("1ere commune", " ")}
        </Text>
        <Flex direction={"row"} gap={2} h={10}>
          {formation?.typeFamille === "2nde_commune" && (
            <Badge variant="info" maxH={5} mt="auto">
              seconde commune
            </Badge>
          )}
          {formation?.typeFamille === "1ere_commune" && (
            <Badge variant="info" maxH={5} mt="auto">
              première commune
            </Badge>
          )}
          {formation?.typeFamille === "specialite" && (
            <Badge variant="purpleGlycine" maxH={5} mt="auto">
              spécialité
            </Badge>
          )}
          {formation?.typeFamille === "option" && (
            <Badge variant="purpleGlycine" maxH={5} mt="auto">
              option
            </Badge>
          )}
          {formation?.voie === "apprentissage" && (
            <Badge variant="new" maxH={5} mt="auto">
              apprentissage
            </Badge>
          )}
          {!checkDataAvailability() && (
            <Badge variant="warning" maxH={5} mt="auto">
              <WarningTwoIcon me={2} />
              Données incomplètes
            </Badge>
          )}
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
