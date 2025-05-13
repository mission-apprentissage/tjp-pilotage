import { Badge, Box, Flex, List, ListItem, Text, Tooltip } from "@chakra-ui/react";
import _ from "lodash";
import { usePlausible } from "next-plausible";
import { CURRENT_RENTREE } from "shared";

import type { Formation } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";
import { BadgesFormationSpecifique } from "@/components/BadgesFormationSpecifique";
import { BadgeTypeFamille } from "@/components/BadgeTypeFamille";
import { BadgeVoieApprentissage } from "@/components/BadgeVoieApprentissage";
import { themeColors } from "@/theme/themeColors";
import { formatFamilleMetierLibelle } from "@/utils/formatLibelle";

const LabelNumberOfFormations = ({ formations }: { formations?: Array<Formation> }) => (
  <Text>
    <strong>{formations?.length ?? 0}</strong> Formation
    {(formations?.length ?? 0) > 1 ? "s" : ""}
  </Text>
);

export const ListeFormations = ({
  formations,
  offre,
  setOffre,
}: {
  formations?: Array<Formation>;
  offre: string;
  setOffre: (offre: string) => void;
}) => {
  const trackEvent = usePlausible();
  const formattedFormations = _.chain(formations)
    .orderBy("ordreFormation", "desc")
    .groupBy("libelleNiveauDiplome")
    .value();

  const onClick = (selectedOffre: string) => {
    setOffre(selectedOffre);
    trackEvent("analyse-detailee-etablissement:interaction", {
      props: {
        type: "liste-formations-click",
        selected_offre: selectedOffre,
      },
    });
  };

  return (
    <Box borderRightWidth={1} borderRightColor={"grey.925"} overflowY={"auto"} h={"90rem"}>
      <Flex flex={1} flexDirection={"row"} justifyContent={"space-between"} me={2}>
        <LabelNumberOfFormations formations={formations} />
        <Badge variant="info">Rentrée {CURRENT_RENTREE}</Badge>
      </Flex>
      <List>
        {Object.keys(formattedFormations).map((codeNiveauDiplome) => (
          <ListItem key={codeNiveauDiplome} ms={3}>
            <Text
              fontWeight={"bold"}
              my={"3"}
            >{`${codeNiveauDiplome} (${formattedFormations[codeNiveauDiplome].length})`}</Text>
            <List>
              {formattedFormations[codeNiveauDiplome].map((formation) => (
                <ListItem
                  key={`${formation.offre}`}
                  ms={3}
                  p={"8px 16px 8px 8px"}
                  cursor={"pointer"}
                  onClick={() => {
                    onClick(formation.offre);
                  }}
                  bgColor={offre === formation.offre ? "bluefrance.925" : ""}
                  _hover={{
                    backgroundColor: offre === formation.offre ? "bluefrance.925_hover" : "grey.1000_active",
                  }}
                  fontWeight={offre === formation.offre ? "bold" : ""}
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
                      borderLeft: offre === formation.offre ? `3px solid ${themeColors.bluefrance[113]}` : "",
                      top: "50%",
                      transform: "translateY(-50%)",
                      position: "absolute",
                    }}
                    paddingLeft={"2px"}
                  >
                    <Tooltip label={formatFamilleMetierLibelle({formation, withBadge: false})}>
                      <Text
                        my={2}
                        color={offre === formation.offre ? "bluefrance.113" : ""}
                        whiteSpace="normal"
                        textOverflow={"ellipsis"}
                        overflow={"hidden"}
                        isTruncated={true}
                        _firstLetter={{ textTransform: "uppercase" }}
                      >
                        {formatFamilleMetierLibelle({formation, withBadge: false})}
                      </Text>
                    </Tooltip>
                    <Flex direction="row" gap={1}>
                      <BadgeVoieApprentissage voie={formation.voie} />
                      <BadgeTypeFamille typeFamille={formation.typeFamille} />
                      <BadgesFormationSpecifique
                        formationSpecifique={formation.formationSpecifique}
                        labelSize={"short"}
                        textTransform={"capitalize"}
                      />
                    </Flex>
                  </Flex>
                </ListItem>
              ))}
            </List>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
