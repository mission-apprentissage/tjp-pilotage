"use client";
import { Alert, Button, Container, VStack } from "@chakra-ui/react";
import NextLink from "next/link";

export const ActivateAccountError = ({ message }: { message: string }) => {
  return (
    <Container maxW="container.sm" pt="6">
      {{
        "user active": (
          <VStack align="center">
            <Alert status="error">Votre compte a déjà été activé.</Alert>
            <Button mt="6" variant="primary" href="/auth/login" as={NextLink}>
              Se connecter
            </Button>
          </VStack>
        ),
      }[message] ?? (
        <VStack align="center">
          <Alert status="error">Le lien est invalide.</Alert>
        </VStack>
      )}
    </Container>
  );
};
