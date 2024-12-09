import { Box, Heading, Img, Text, VStack } from "@chakra-ui/react";

import { themeDefinition } from "@/theme/theme";
import { themeColors } from "@/theme/themeColors";

const QuadrantPlaceholder = () => {
  return (
    <VStack
      mt={6}
      width="100%"
      backgroundColor={themeColors.grey[975]}
      color={themeColors.grey[625]}
      paddingY="132px"
      paddingX="56px"
    >
      <Heading as="h3">Aucune donnée à afficher</Heading>
      <Text>
        Pour afficher le quadrant, sélectionner un{" "}
        <b>
          <u>niveau de diplôme</u>
        </b>{" "}
        et une{" "}
        <b>
          <u>zone géographique</u>
        </b>{" "}
        dans les filtres en haut de page
      </Text>
      <Box width="160px" height="160px" borderRadius="120px" backgroundColor={themeDefinition.colors.bluefrance[975]}>
        <Img src="/illustrations/search.svg" />
      </Box>
    </VStack>
  );
};

export default QuadrantPlaceholder;
