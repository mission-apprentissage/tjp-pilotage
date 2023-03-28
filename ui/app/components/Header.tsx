import { Link } from "@chakra-ui/next-js";
import { Box, Container, Heading, HStack, Img, VStack } from "@chakra-ui/react";

import { Nav } from "./Nav";

export const Header = () => {
  return (
    <VStack
      zIndex={1}
      spacing="0"
      divider={
        <Box
          width="100%"
          borderBottom="1px solid"
          borderBottomColor="grey.900"
        />
      }
      align={"start"}
      boxShadow="0 2px 6px 1px rgba(0, 0, 0, 0.1)"
    >
      <HStack as={Container} py={2} maxWidth={"container.xl"}>
        <HStack as={Link} spacing={10} align="center" href="/">
          <Img src="/logo_gouvernement.svg" />
          <Heading as={"h1"} size={"md"}>
            Orion, pilotage de la carte des formations
          </Heading>
        </HStack>
      </HStack>
      <Container maxWidth={"container.xl"}>
        <Nav />
      </Container>
    </VStack>
  );
};
