import { WarningTwoIcon } from "@chakra-ui/icons";
import { Badge, Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";

import { ChiffresIJOffre, Formation } from "../../types";
import { TauxDevenirFavorable } from "./TauxDevenirFavorable";
import { TauxEmploi } from "./TauxEmploi";
import { TauxPoursuiteEtudes } from "./TauxPoursuiteEtudes";

const isAnyDataMissing = (
  formation?: Formation,
  chiffresIJOffre?: ChiffresIJOffre
) => {
  if (!chiffresIJOffre) {
    if (
      formation &&
      (formation.typeFamille === "2nde_commune" ||
        formation.typeFamille === "1ere_commune")
    ) {
      return false;
    }
    return true;
  }

  return Object.values(chiffresIJOffre).reduce((acc, value) => {
    if (
      typeof value.tauxInsertion === "undefined" ||
      typeof value.tauxPoursuite === "undefined" ||
      typeof value.tauxDevenirFavorable === "undefined"
    ) {
      return true;
    }
    return acc;
  }, false);
};

export const DevenirSection = ({
  formation,
  chiffresIJOffre,
}: {
  formation?: Formation;
  chiffresIJOffre?: ChiffresIJOffre;
}) => (
  <Box>
    <Flex
      direction={"row"}
      justifyContent={"flex-start"}
      gap={"8px"}
      alignItems={"center"}
      mb={4}
    >
      <Text
        fontSize={14}
        fontWeight={700}
        textTransform={"uppercase"}
        lineHeight={"24px"}
      >
        Devenir des élèves
      </Text>

      {isAnyDataMissing(formation, chiffresIJOffre) && (
        <Badge variant="grey" maxH={5}>
          <WarningTwoIcon me={2} />
          Données incomplètes
        </Badge>
      )}
    </Flex>
    <Grid templateColumns={"repeat(3, 1fr)"} gap={4}>
      <GridItem colSpan={1}>
        <TauxEmploi chiffresIJOffre={chiffresIJOffre} />
      </GridItem>
      <GridItem colSpan={1}>
        <TauxPoursuiteEtudes chiffresIJOffre={chiffresIJOffre} />
      </GridItem>
      <GridItem colSpan={1}>
        <TauxDevenirFavorable chiffresIJOffre={chiffresIJOffre} />
      </GridItem>
    </Grid>
  </Box>
);
