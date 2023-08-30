"use client";

import { Box, Button, Container, Flex, Heading } from "@chakra-ui/react";
import NextLink from "next/link";

export const PageClient = () => {
  return (
    <Container pt="4" maxW="container.xl">
      <Flex align="baseline">
        <Heading>Intentions</Heading>
        <Button
          ml="auto"
          variant="primary"
          as={NextLink}
          href="/intentions/new"
        >
          Nouvelle demande
        </Button>
      </Flex>

      <Box mt="10">
        <Button variant="primary" as={NextLink} href="/intentions/fdsnknsd">
          Demande existante
        </Button>
      </Box>
    </Container>
  );
};
