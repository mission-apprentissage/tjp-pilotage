import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";

import type { ChiffresIJOffre } from "@/app/(wrapped)/panorama/etablissement/components/analyse-detaillee/types";

import { TauxDevenirFavorable } from "./TauxDevenirFavorable";
import { TauxEmploi } from "./TauxEmploi";
import { TauxPoursuiteEtudes } from "./TauxPoursuiteEtudes";

export const DevenirSection = ({ chiffresIJOffre }: { chiffresIJOffre?: ChiffresIJOffre }) => (
  <Box>
    <Flex direction={"row"} justifyContent={"flex-start"} gap={"8px"} alignItems={"center"} mb={4}>
      <Text fontSize={14} fontWeight={700} textTransform={"uppercase"} lineHeight={"24px"}>
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
  </Box>
);
