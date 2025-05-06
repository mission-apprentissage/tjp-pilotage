"use client";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";

const Page = () => {
  return (
    <Flex mt="12" mx="auto" direction="column" align="center">
      <Heading fontSize="lg">Votre compte a bien été activé !</Heading>
      <Text mt="2">Vous pouvez désormais vous connecter à Orion.</Text>
      <Button mt="6" as={NextLink} href="/auth/login" variant="primary">
        Se connecter
      </Button>
    </Flex>
  );
};

export default Page;
