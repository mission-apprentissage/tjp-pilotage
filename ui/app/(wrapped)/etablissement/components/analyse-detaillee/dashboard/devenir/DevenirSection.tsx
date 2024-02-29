import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";

import { ChiffresIJOffre } from "../../types";
import { TauxDevenirFavorable } from "./TauxDevenirFavorable";
import { TauxEmploi } from "./TauxEmploi";
import { TauxPoursuiteEtudes } from "./TauxPoursuiteEtudes";

export const DevenirSection = ({
  chiffresIJOffre,
}: {
  chiffresIJOffre?: ChiffresIJOffre;
}) => {
  return (
    <>
      <Flex direction={"row"} justifyContent={"space-between"}>
        <Text
          fontSize={14}
          fontWeight={700}
          textTransform={"uppercase"}
          lineHeight={"24px"}
        >
          Devenir des élèves
        </Text>
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
