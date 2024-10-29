"use client";

import { Box, HStack, Link, StackDivider, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { usePlausible } from "next-plausible";

export const MinimalFooter = () => {
  const trackEvent = usePlausible();

  return (
    <VStack
      mt={"auto"}
      borderTop="1px"
      borderTopColor={"grey.900"}
      backgroundColor={"white"}
      padding={{
        base: "16px",
        md: "20px 100px 20px 100px",
      }}
      zIndex={10}
    >
      <HStack
        width="100%"
        fontSize="11px"
        color={"grey.425"}
        gap={{
          base: "4px 4px",
          md: "4px",
        }}
        divider={<StackDivider borderColor={"grey.900"} />}
        wrap="wrap"
        justifyContent={"center"}
      >
        <Box>
          <Link as={NextLink} href="/mentions-legales" onClick={() => trackEvent("footer:mentions-legales")}>
            Mentions légales
          </Link>
        </Box>
        <Box>
          <Link as={NextLink} href="/cgu" onClick={() => trackEvent("footer:cgu")}>
            CGU
          </Link>
        </Box>
        <Box>
          <Link
            as={NextLink}
            href="/politique-de-confidentialite"
            onClick={() => trackEvent("footer:politique-de-confidentialite")}
          >
            Politique de confidentialité
          </Link>
        </Box>
        <Box>
          <Link as={NextLink} href="/changelog" onClick={() => trackEvent("footer:journal-des-mises-a-jour")}>
            Journal des mises à jour
          </Link>
        </Box>
        <Box>
          <Link href="mailto:orion@inserjeunes.beta.gouv.fr">Nous contacter : orion@inserjeunes.beta.gouv.fr</Link>
        </Box>
        <Box>
          <Link as={NextLink} href="/statistiques" onClick={() => trackEvent("footer:statistiques")}>
            Statistiques
          </Link>
        </Box>
        <Box>
          <Link
            as={NextLink}
            href="/declaration-accessibilite"
            onClick={() => trackEvent("footer:declaration-accessibilite")}
          >
            Accessibilité : non conforme
          </Link>
        </Box>
        <Box>
          <Link
            as={NextLink}
            href="https://beta.gouv.fr/accessibilite/schema-pluriannuel"
            target="_blank"
            onClick={() => trackEvent("footer:schéma-pluriannuel-accessibilite")}
          >
            Schéma pluriannuel d’accessibilité
          </Link>
        </Box>
        <Box>
          <Link as={NextLink} href="/ressources" onClick={() => trackEvent("footer:ressources")}>
            Ressources
          </Link>
        </Box>
      </HStack>
    </VStack>
  );
};
