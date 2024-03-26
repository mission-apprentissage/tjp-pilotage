import { WarningTwoIcon } from "@chakra-ui/icons";
import { Badge, Flex, Grid, GridItem, Text } from "@chakra-ui/react";

import { ChiffresIJOffre } from "../../types";
import { TauxDevenirFavorable } from "./TauxDevenirFavorable";
import { TauxEmploi } from "./TauxEmploi";
import { TauxPoursuiteEtudes } from "./TauxPoursuiteEtudes";

const isAnyDataMissing = (chiffresIJOffre?: ChiffresIJOffre) =>
  !chiffresIJOffre ||
  typeof chiffresIJOffre.tauxInsertion === "undefined" ||
  typeof chiffresIJOffre.tauxPoursuite === "undefined" ||
  typeof chiffresIJOffre.tauxDevenirFavorable === "undefined";

export const DevenirSection = ({
  chiffresIJOffre,
}: {
  chiffresIJOffre?: ChiffresIJOffre;
}) => {
  return (
    <>
      <Flex
        direction={"row"}
        justifyContent={"flex-start"}
        gap={"8px"}
        alignItems={"center"}
      >
        <Text
          fontSize={14}
          fontWeight={700}
          textTransform={"uppercase"}
          lineHeight={"24px"}
        >
          Devenir des élèves
        </Text>

        {isAnyDataMissing(chiffresIJOffre) && (
          <Badge variant="warning" maxH={5}>
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
    </>
  );
};
