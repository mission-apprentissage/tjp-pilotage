import { chakra, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import type {AvisStatutType} from "shared/enum/avisStatutEnum";
import { AvisStatutEnum  } from "shared/enum/avisStatutEnum";

import { AvisStatutTag } from "@/app/(wrapped)/demandes/components/AvisStatutTag";
import type { Demande } from "@/app/(wrapped)/demandes/types";

const getNbAvisStatutAvis = ({demande, statut}: {demande: Demande, statut: AvisStatutType}) => {
  return demande.avis?.filter((avis) => avis.statutAvis === statut).length ?? 0;
};
export const CompteursAvisSection = chakra(
  ({ demande }: { demande: Demande }) => {

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
                {getNbAvisStatutAvis({
                  demande,
                  statut: AvisStatutEnum["défavorable"]
                })}
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
                {getNbAvisStatutAvis({
                  demande,
                  statut: AvisStatutEnum["réservé"]
                })}
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
                {getNbAvisStatutAvis({
                  demande,
                  statut: AvisStatutEnum["favorable"]
                })}
              </Text>
            </Flex>
          </GridItem>
        </Grid>
      </Flex>
    );
  }
);
