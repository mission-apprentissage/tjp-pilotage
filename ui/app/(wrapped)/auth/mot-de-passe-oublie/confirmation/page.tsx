"use client";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import NextLink from "next/link";

const Page = () => {
  return (
    <Flex mt="12" mx="auto" direction="column" align="center">
      <Heading fontSize="lg">Demande confirmée !</Heading>
      <Text mt="2">Un email de réinitialisation du mot de passe vous a été envoyé.</Text>
      <Button mt="6" as={NextLink} href="/" variant="primary">
        Retour à l'accueil
      </Button>
    </Flex>
  );
};
export default Page;
