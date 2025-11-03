"use client";
import { Alert, Button, Flex, Heading, Highlight,Text } from "@chakra-ui/react";
import NextLink from "next/link";

const Page = () => {
  return (
    <Flex mt="12" mx="auto" direction="column" align="center">
      <Heading fontSize="lg">Demande confirmée !</Heading>
      <Text mt="2">Un email de réinitialisation du mot de passe vous a été envoyé.</Text>
      <Alert status="warning" mt="4" maxW="800px" textAlign="center" flexDirection={"column"} gap={2}>
        <Text>
          Pensez à vérifier vos spams si vous ne voyez pas l'email dans votre boîte de réception.
        </Text>
        <Text>
          <Highlight query="15 minutes" styles={{ textDecoration: "underline" }}>
            Le mail pourrait prendre jusqu'à 15 minutes pour arriver.
          </Highlight>
        </Text>
      </Alert>
      <Button mt="6" as={NextLink} href="/" variant="primary">
        Retour à l'accueil
      </Button>
    </Flex>
  );
};
export default Page;
