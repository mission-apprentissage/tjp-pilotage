"use client";

import { Box, HStack, Link, StackDivider, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";

import { publicConfig } from "@/config.public";

export const MinimalFooter = () => {
  return (
    <VStack
      mt={"auto"}
      borderTop="1px"
      borderTopColor={"grey.900"}
      backgroundColor={"white"}
      padding={4}
      zIndex={"docked"}
    >
      <HStack
        width="100%"
        fontSize="11px"
        color={"grey.425"}
        gap={2}
        divider={<StackDivider borderColor={"grey.900"} />}
        wrap="wrap"
        justifyContent={"center"}
      >
        <Box>
          <Link as={NextLink} href="/mentions-legales">
            Mentions légales
          </Link>
        </Box>
        <Box>
          <Link as={NextLink} href="/cgu">
            CGU
          </Link>
        </Box>
        <Box>
          <Link
            as={NextLink}
            href="/politique-de-confidentialite"
          >
            Politique de confidentialité
          </Link>
        </Box>
        <Box>
          <Link as={NextLink} href="/changelog">
            Journal des mises à jour
          </Link>
        </Box>
        <Box>
          <Link as={NextLink} href="/statistiques">
            Statistiques
          </Link>
        </Box>
        <Box>
          <Link
            as={NextLink}
            href="/declaration-accessibilite"
          >
            Accessibilité : non conforme
          </Link>
        </Box>
        <Box>
          <Link
            as={NextLink}
            href="https://beta.gouv.fr/accessibilite/schema-pluriannuel"
            target="_blank"
          >
            Schéma pluriannuel d’accessibilité
          </Link>
        </Box>
        <Box>
          <Link as={NextLink} href="/ressources">
            Ressources
          </Link>
        </Box>
        <Box>
          <Text>v{publicConfig.version}</Text>
        </Box>
      </HStack>
    </VStack>
  );
};
