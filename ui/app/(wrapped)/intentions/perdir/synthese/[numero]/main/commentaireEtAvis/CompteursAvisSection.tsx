import { chakra, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import type { AvisStatutType } from "shared/enum/avisStatutEnum";

import type { client } from "@/api.client";
import { AvisStatutTag } from "@/app/(wrapped)/intentions/perdir/components/AvisStatutTag";

export const CompteursAvisSection = chakra(
  ({ intention }: { intention: (typeof client.infer)["[GET]/intention/:numero"] }) => {
    const getNbAvisStatutAvis = (statut: AvisStatutType) => {
      return intention.avis?.filter((avis) => avis.statutAvis === statut).length ?? 0;
    };

    return (
      <Flex direction={"row"}>
        <Grid templateColumns={"repeat(3, 1fr)"} gap={6} flex={1} width={"100%"}>
          <GridItem>
            <Flex
              direction={"column"}
              gap={1}
              width={"100%"}
              border={"1px solid"}
              borderColor={"grey.925"}
              padding={4}
              borderRadius={4}
            >
              <Text fontSize={14}>Avis exprimé(s)</Text>
              <AvisStatutTag
                statutAvis="défavorable"
                w={"fit-content"}
                size={"md"}
                textTransform={"uppercase"}
                gap={2}
                hasIcon
              />
              <Text fontSize={32} fontWeight={700}>
                {getNbAvisStatutAvis("défavorable")}
              </Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex
              direction={"column"}
              gap={1}
              width={"100%"}
              border={"1px solid"}
              borderColor={"grey.925"}
              padding={4}
              borderRadius={4}
            >
              <Text fontSize={14}>Avis exprimé(s)</Text>
              <AvisStatutTag
                statutAvis="réservé"
                w={"fit-content"}
                size={"md"}
                textTransform={"uppercase"}
                gap={2}
                hasIcon
              />
              <Text fontSize={32} fontWeight={700}>
                {getNbAvisStatutAvis("réservé")}
              </Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex
              direction={"column"}
              gap={1}
              width={"100%"}
              border={"1px solid"}
              borderColor={"grey.925"}
              padding={4}
              borderRadius={4}
            >
              <Text fontSize={14}>Avis exprimé(s)</Text>
              <AvisStatutTag
                statutAvis="favorable"
                w={"fit-content"}
                size={"md"}
                textTransform={"uppercase"}
                gap={2}
                hasIcon
              />
              <Text fontSize={32} fontWeight={700}>
                {getNbAvisStatutAvis("favorable")}
              </Text>
            </Flex>
          </GridItem>
        </Grid>
      </Flex>
    );
  },
);
