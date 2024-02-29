import { Box, List, ListItem, Text } from "@chakra-ui/react";
import _ from "lodash";

import { Formation } from "../types";

export const ListeFormations = ({
  formations,
  offre,
  setOffre,
}: {
  formations?: Array<Formation>;
  offre: string;
  setOffre: (offre: string) => void;
}) => {
  const formattedFormations = _.chain(formations)
    .orderBy("libelleFormation", "asc")
    .groupBy("libelleNiveauDiplome")
    .value();

  return (
    <Box borderRightWidth={1} borderRightColor={"grey.925"}>
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
                  <Text
                    my={2}
                    color={offre === formation.offre ? "bluefrance.113" : ""}
                  >
                    {formation.libelleFormation}
                  </Text>
                </ListItem>
              ))}
            </List>
          </ListItem>
        ))}
        <ListItem></ListItem>
      </List>
    </Box>
  );
};
