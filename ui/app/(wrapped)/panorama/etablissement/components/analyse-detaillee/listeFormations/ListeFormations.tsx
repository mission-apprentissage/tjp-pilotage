import {
  Badge,
  Box,
  Flex,
  List,
  ListItem,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import _ from "lodash";
import { CURRENT_RENTREE } from "shared";

import {
  formatAnneeCommuneLibelle,
  formatTypeFamilleCourt,
  formatTypeFamilleLong,
} from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/formatData";

import { themeColors } from "../../../../../../../theme/themeColors";
import { Formation } from "../types";

export const ListeFormations = ({
  formations,
  offre,
  setOffre,
  nbOffres,
}: {
  formations?: Array<Formation>;
  offre: string;
  setOffre: (offre: string) => void;
  nbOffres: Record<string, number>;
}) => {
  const formattedFormations = _.chain(formations)
    .orderBy("ordreFormation", "desc")
    .groupBy("libelleNiveauDiplome")
    .value();

  const totalNbOffres = Object.values(nbOffres).reduce(
    (acc, nbOffres) => acc + nbOffres,
    0
  );

  return (
    <Box
      borderRightWidth={1}
      borderRightColor={"grey.925"}
      overflowY={"auto"}
      h={"85rem"}
    >
      <Flex
        flex={1}
        flexDirection={"row"}
        justifyContent={"space-between"}
        me={2}
      >
        <Flex>
          <Text fontWeight={700}>{totalNbOffres}</Text>
          <Text>&nbsp;Formation(s)</Text>
        </Flex>
        <Badge variant="info">Rentrée {CURRENT_RENTREE}</Badge>
      </Flex>
      <List>
        {Object.keys(formattedFormations).map((codeNiveauDiplome) => (
          <ListItem key={codeNiveauDiplome} ms={3}>
            <Text
              fontWeight={"bold"}
              my={"3"}
            >{`${codeNiveauDiplome} (${nbOffres[codeNiveauDiplome]})`}</Text>
            <List>
              {formattedFormations[codeNiveauDiplome].map((formation) => (
                <ListItem
                  key={`${formation.offre}`}
                  ms={3}
                  p={"8px 16px 8px 8px"}
                  cursor={"pointer"}
                  onClick={() => {
                    setOffre(formation.offre);
                  }}
                  bgColor={offre === formation.offre ? "bluefrance.925" : ""}
                  _hover={{
                    backgroundColor:
                      offre === formation.offre
                        ? "bluefrance.925_hover"
                        : "grey.1000_active",
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
                      borderLeft: offre === formation.offre
                      ? `3px solid ${themeColors.bluefrance[113]}`
                      : "",
                      top: "50%",
                      transform: "translateY(-50%)",
                      position: "absolute",
                    }}
                    paddingLeft={"2px"}
                  >
                    <Tooltip
                      label={formatAnneeCommuneLibelle(
                        formation.libelleFormation
                      )}
                    >
                      <Text
                        my={2}
                        color={
                          offre === formation.offre ? "bluefrance.113" : ""
                        }
                        whiteSpace="normal"
                        textOverflow={"ellipsis"}
                        overflow={"hidden"}
                        isTruncated={true}
                      >
                        {formatAnneeCommuneLibelle(formation.libelleFormation)}
                      </Text>
                    </Tooltip>
                    <Flex direction="row" gap={1}>
                      {(formation.typeFamille === "2nde_commune" ||
                        formation.typeFamille === "1ere_commune") && (
                        <Tooltip
                          label={formatTypeFamilleLong(formation.typeFamille)}
                        >
                          <Badge variant={"info"} size="xs">
                            {formatTypeFamilleCourt(formation.typeFamille)}
                          </Badge>
                        </Tooltip>
                      )}
                      {(formation.typeFamille === "specialite" ||
                        formation.typeFamille === "option") && (
                        <Tooltip
                          label={formatTypeFamilleLong(formation.typeFamille)}
                        >
                          <Badge variant={"purpleGlycine"} size="xs">
                            {formatTypeFamilleCourt(formation.typeFamille)}
                          </Badge>
                        </Tooltip>
                      )}
                      {formation.voie === "apprentissage" && (
                        <Tooltip label={"Apprentissage"}>
                          <Badge variant={"new"} size="xs">
                            Appr
                          </Badge>
                        </Tooltip>
                      )}
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
