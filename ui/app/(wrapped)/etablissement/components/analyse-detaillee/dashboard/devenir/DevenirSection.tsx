import { Grid, GridItem, Text } from "@chakra-ui/react";

import { ChiffresIJ } from "../../types";
import { TauxDevenirFavorable } from "./TauxDevenirFavorable";
import { TauxEmploi } from "./TauxEmploi";
import { TauxPoursuiteEtudes } from "./TauxPoursuiteEtudes";

export const DevenirSection = ({ chiffresIj }: { chiffresIj?: ChiffresIJ }) => {
  return (
    <>
      <Text
        fontSize={14}
        fontWeight={700}
        textTransform={"uppercase"}
        lineHeight={"24px"}
      >
        Devenir des élèves
      </Text>
      <Grid templateColumns={"repeat(3, 1fr)"} gap={4}>
        <GridItem colSpan={1}>
          <TauxEmploi chiffresIj={chiffresIj} />
        </GridItem>
        <GridItem colSpan={1}>
          <TauxPoursuiteEtudes chiffresIj={chiffresIj} />
        </GridItem>
        <GridItem colSpan={1}>
          <TauxDevenirFavorable chiffresIj={chiffresIj} />
        </GridItem>
      </Grid>
    </>
  );
};
