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
    <Box borderRightWidth={1} borderRightColor={"grey.925"}>
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
        <Badge variant="info">Rentrée 2023</Badge>
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
                  bgColor={offre === formation.offre ? "grey.1000_active" : ""}
                  borderLeftColor={
                    offre === formation.offre ? "bluefrance.113" : ""
                  }
                  borderLeft={offre === formation.offre ? "2px" : ""}
                >
                  <Flex direction="row" justify={"space-between"}>
                    <Tooltip
                      label={formation.libelleFormation
                        .replace("2nde commune", "")
                        .replace("1ere commune", "")}
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
                        {formation.libelleFormation
                          .replace("2nde commune", "")
                          .replace("1ere commune", "")}
                      </Text>
                    </Tooltip>
                    {(formation.typeFamille === "2nde_commune" ||
                      formation.typeFamille === "1ere_commune") && (
                      <Tooltip
                        label={formation.typeFamille
                          .replace("2nde_commune", "Seconde commune")
                          .replace("1ere_commune", "Première commune")}
                      >
                        <Badge variant={"info"} size="xs">
                          {formation.typeFamille
                            .replace("2nde_commune", "2nde")
                            .replace("1ere_commune", "1ère")}
                        </Badge>
                      </Tooltip>
                    )}
                    {(formation.typeFamille === "specialite" ||
                      formation.typeFamille === "option") && (
                      <Tooltip
                        label={formation.typeFamille
                          .replace("specialite", "Spécialité")
                          .replace("option", "Option")}
                      >
                        <Badge variant={"purpleGlycine"} size="xs">
                          {formation.typeFamille
                            .replace("specialite", "Spé")
                            .replace("option", "Opt")}
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
                </ListItem>
              ))}
            </List>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
