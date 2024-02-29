import { Badge, Box, Flex, List, ListItem, Text } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
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
    <Box
      borderRightWidth={1}
      borderRightColor={"grey.925"}
      overflowY="auto"
      maxH={"84rem"}
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
                  p={1}
                  ps={2}
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
                  <Flex direction="row">
                    <Text
                      my={2}
                      color={offre === formation.offre ? "bluefrance.113" : ""}
                      whiteSpace="normal"
                      textOverflow={"ellipsis"}
                      isTruncated={true}
                    >
                      {formation.libelleFormation
                        .replace("2nde commune", "")
                        .replace("1ere commune", "")}
                    </Text>
                    {(formation.typeFamille === "2nde_commune" ||
                      formation.typeFamille === "1ere_commune") && (
                      <Text color="bluefrance.113" ms={2} my="auto">
                        <Icon
                          icon="ri:node-tree"
                          color="inherit"
                          width={16}
                          height={16}
                        />
                      </Text>
                    )}
                    {(formation.typeFamille === "specialite" ||
                      formation.typeFamille === "option") && (
                      <Text color="bluefrance.113" ms={2} my="auto">
                        <Icon
                          icon="ri:git-branch-line"
                          color="inherit"
                          width={16}
                          height={16}
                        />
                      </Text>
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
