"use client";
import { Box, Flex, Text } from "@chakra-ui/react";

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  return (
    <Flex height="100vh" width="100%" direction="column">
      <Text mb="2" mt="3" textAlign="center">
        Pour remonter les incohérences constatées, merci d'envoyer un mail à orion@inserjeunes.beta.gouv.fr.
      </Text>
      <Box
        border="none"
        bg="transparent"
        as="iframe"
        flex="1"
        src="https://public.tableau.com/views/Formationsetmtiers-ORION/Entreparmtier?:embed=y&:showVizHome=no&:host_url=https%3A%2F%2Fpublic.tableau.com%2F&:embed_code_version=3&:toolbar=yes&:tabs=no&:animate_transition=yes&:display_static_image=no&:display_spinner=no&:display_overlay=yes&:display_count=yes&:language=fr-FR&:loadOrderID=0"
      />
    </Flex>
  );
};
