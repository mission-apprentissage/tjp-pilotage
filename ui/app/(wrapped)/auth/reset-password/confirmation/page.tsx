"use client";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";

// eslint-disable-next-line import/no-anonymous-default-export, react/display-name
export default () => {
  return (
    <Flex mt="12" mx="auto" direction="column" align="center">
      <Heading fontSize="lg">Votre mot de passe a bien été modifié !</Heading>
      <Text mt="2">Vous pouvez désormais vous connecter à Orion.</Text>
      <Button mt="6" as={NextLink} href="/auth/login" variant="primary">
        Se connecter
      </Button>
    </Flex>
  );
};
