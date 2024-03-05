import {
  Badge,
  Box,
  Flex,
  List,
  ListItem,
  Text,
  Tooltip,
} from "@chakra-ui/react";
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
                        <Text color="bluefrance.113" ms={2} me={1} my="auto">
                          <Icon
                            icon="ri:node-tree"
                            color="inherit"
                            width={"16px"}
                            height={"16px"}
                          />
                        </Text>
                      </Tooltip>
                    )}
                    {(formation.typeFamille === "specialite" ||
                      formation.typeFamille === "option") && (
                      <Tooltip
                        label={formation.typeFamille
                          .replace("specialite", "Spécialité")
                          .replace("option", "Option")}
                      >
                        <Text color="bluefrance.113" ms={2} me={1} my="auto">
                          <Icon
                            icon="ri:node-tree"
                            color="inherit"
                            width={"16px"}
                            height={"16px"}
                            rotate={270}
                          />
                        </Text>
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
