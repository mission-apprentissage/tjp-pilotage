import { Container, Flex, Heading, Img, Text, VStack } from "@chakra-ui/react";

import { themeColors } from "@/theme/themeColors";

export const EmptyDataBoard = () => {
  return (
    <Container maxWidth={"full"} px={0}>
      <VStack mt={16} mb={5} width="100%" backgroundColor={themeColors.grey[975]} color={themeColors.grey[625]} py={"132px"} px={"200px"}>
        <Heading as="h2" fontSize={"20px"} fontWeight={"700"}>Aucune donnée à afficher</Heading>
        <Text size="md" align={"center"} my={4}>
          Le taux de transformation ne peut être calculé pour ce niveau de diplôme car il n'y a pas de données d'effectifs disponibles au dénominateur.
          Vous pouvez <b><a href="/suivi-impact" style={{ textDecoration: "underline" }}>consulter les données pour tous les diplômes</a></b> ou sélectionner un autre niveau de diplôme dans le filtre.
        </Text>
        <Flex flex={1} backgroundColor={themeColors.grey[975]}>
          <Img src="/illustrations/search.svg" alt="Icône rechercher"/>
        </Flex>
      </VStack>
    </Container>
  );
};
