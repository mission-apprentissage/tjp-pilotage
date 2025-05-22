import { Badge, Box, Divider, Flex, List, ListItem, Text, Tooltip } from "@chakra-ui/react";
import _ from "lodash";
import { CURRENT_RENTREE, VoieEnum } from "shared";

import { useDomaineDeFormation } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/domaineDeFormationContext";
import { useFormationContext } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/context/formationContext";
import type { FormationListItem } from "@/app/(wrapped)/panorama/domaine-de-formation/[codeNsf]/types";
import { formatFamilleMetierLibelle } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData";
import { BadgeFormationRenovee } from "@/components/BadgeFormationRenovee";
import type { TypeFamilleKeys } from "@/components/BadgeTypeFamille";
import { BadgeTypeFamille } from "@/components/BadgeTypeFamille";
import { BadgeVoieApprentissage } from "@/components/BadgeVoieApprentissage";
import { BadgeVoieScolaire } from "@/components/BadgeVoieScolaire";
import { themeColors } from "@/theme/themeColors";

const LabelNumberOfFormations = ({ formations }: { formations: number }) => (
  <Text>
    <strong>{formations}</strong> Formation
    {formations > 1 ? "s" : ""}
  </Text>
);

export const ListeFormations = () => {
  const {
    handleCfdChange: selectCfd,
    currentFilters: {
      selection: { cfd: selectedCfd }
    }
  } = useFormationContext();

  const { formationsByLibelleNiveauDiplome } = useDomaineDeFormation();

  const isFormationSelected = (formation: FormationListItem) => {
    return formation.cfd === selectedCfd;
  };

  const getBackgroundColor = (formation: FormationListItem) => {
    if (isFormationSelected(formation)) {
      return "bluefrance.925";
    }

    if (formation.nbEtab === 0) {
      return "grey.925";
    }

    return undefined;
  };

  const getFontColor = (formation: FormationListItem) => {
    if (isFormationSelected(formation)) {
      return "bluefrance.113";
    }

    if (formation.nbEtab === 0) {
      return "grey.625";
    }

    return undefined;
  };

  return (
    <Box
      borderRightWidth={1}
      borderRightColor={"grey.925"}
      overflowY={"auto"}
      height="inherit"
      position="relative"
      w={"40%"}
    >
      <Box position="absolute" height="100%" width="100%" overflow="auto">
        <Flex flex={1} flexDirection={"row"} justifyContent={"space-between"} mx={"8px"} my={"16px"}>
          <LabelNumberOfFormations
            formations={_.sumBy(Object.values(formationsByLibelleNiveauDiplome), (arr) => arr.length)}
          />
          <Badge variant="info">Rentrée {CURRENT_RENTREE}</Badge>
        </Flex>
        <Divider />
        <List>
          {Object.entries(formationsByLibelleNiveauDiplome).map(([libelleNiveauDiplome, formations]) => (
            <ListItem key={libelleNiveauDiplome} ms={3}>
              <Text fontWeight={"bold"} my={"3"}>{`${libelleNiveauDiplome} (${formations.length})`}</Text>
              <List>
                {formations.map((formation) => (
                  <ListItem
                    key={`${formation.cfd}_${formation.voies.join(',')}`}
                    ms={3}
                    p={"8px 16px 8px 8px"}
                    cursor={"pointer"}
                    onClick={() => {
                      selectCfd({ cfd: formation.cfd });
                    }}
                    bgColor={getBackgroundColor(formation)}
                    _hover={{
                      backgroundColor: isFormationSelected(formation) ? "bluefrance.925_hover" : "grey.1000_active",
                    }}
                    fontWeight={isFormationSelected(formation) ? "bold" : ""}
                    position={"relative"}
                  >
                    <Flex
                      direction="row"
                      justify={"space-between"}
                      _before={{
                        content: "''",
                        width: "0",
                        height: "60%",
                        left: "0",
                        borderLeft: isFormationSelected(formation) ? `3px solid ${themeColors.bluefrance[113]}` : "",
                        top: "50%",
                        transform: "translateY(-50%)",
                        position: "absolute",
                      }}
                      paddingLeft={"2px"}
                    >
                      <Tooltip label={formatFamilleMetierLibelle(formation.libelleFormation)}>
                        <Text
                          my={2}
                          color={getFontColor(formation)}
                          whiteSpace="normal"
                          textOverflow={"ellipsis"}
                          overflow={"hidden"}
                          isTruncated={true}
                          _firstLetter={{ textTransform: "uppercase" }}
                        >
                          {formatFamilleMetierLibelle(formation.libelleFormation)}
                        </Text>
                      </Tooltip>
                      <Flex direction="row" gap={1}>
                        <BadgeTypeFamille typeFamille={formation.typeFamille as TypeFamilleKeys} />
                        <BadgeFormationRenovee isFormationRenovee={formation.isFormationRenovee} />
                        <BadgeVoieScolaire voie={formation.voies.find(v => v === VoieEnum.scolaire)} />
                        <BadgeVoieApprentissage voie={formation.voies.find(v => v === VoieEnum.apprentissage)} />
                      </Flex>
                    </Flex>
                  </ListItem>
                ))}
              </List>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
