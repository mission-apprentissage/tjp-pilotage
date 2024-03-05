import { WarningTwoIcon } from "@chakra-ui/icons";
import { Badge, Flex } from "@chakra-ui/react";
import { Icon } from "@iconify/react";

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
      <Flex direction={"row"} gap={2} h={10}>
        {formation?.typeFamille === "2nde_commune" && (
          <Badge variant="info" maxH={5} mt="auto">
            <Flex me={2}>
              <Icon icon="ri:node-tree" color="inherit"></Icon>
            </Flex>
            seconde commune
          </Badge>
        )}
        {formation?.typeFamille === "1ere_commune" && (
          <Badge variant="info" maxH={5} mt="auto">
            <Flex me={2}>
              <Icon icon="ri:node-tree" color="inherit"></Icon>
            </Flex>
            première commune
          </Badge>
        )}
        {formation?.typeFamille === "specialite" && (
          <Badge variant="info" maxH={5} mt="auto">
            <Flex me={2}>
              <Icon icon="ri:node-tree" color="inherit"></Icon>
            </Flex>
            spécialité
          </Badge>
        )}
        {formation?.typeFamille === "option" && (
          <Badge variant="info" maxH={5} mt="auto">
            <Flex me={2}>
              <Icon icon="ri:node-tree" color="inherit"></Icon>
            </Flex>
            option
          </Badge>
        )}
        {!checkDataAvailability() && (
          <Badge variant="warning" maxH={5} mt="auto">
            <WarningTwoIcon me={2} />
            Données incomplètes
          </Badge>
        )}
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
