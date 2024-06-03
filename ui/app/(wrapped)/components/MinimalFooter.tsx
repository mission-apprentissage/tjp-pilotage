"use client";

import {
  Box,
  HStack,
  Link,
  Stack,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
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
      zIndex={10}
    >
      <Stack
        padding={{
          base: "16px",
          md: "20px 120px 20px 100px",
        }}
        width="100%"
        spacing="24px"
      >
        <HStack
          width="100%"
          fontSize="12px"
          color={"grey.425"}
          gap={{
            base: "8px 8px",
            md: "16px",
          }}
          divider={<StackDivider borderColor={"grey.900"} />}
          wrap="wrap"
        >
          <Box>
            <Link as={NextLink} href="/mentions-legales">
              Mentions légales
            </Link>
          </Box>
          <Box>
            <Link
              as={NextLink}
              href="/changelog"
              onClick={() => trackEvent("footer:journal-des-mises-a-jour")}
            >
              Journal des mises à jour
            </Link>
          </Box>
          <Box>
            <Link href="mailto:orion@inserjeunes.beta.gouv.fr">
              Nous contacter : orion@inserjeunes.beta.gouv.fr
            </Link>
          </Box>
          <Box>
            <Link
              as={NextLink}
              href="/statistiques"
              onClick={() => trackEvent("footer:statistiques")}
            >
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
              onClick={() =>
                trackEvent("footer:schéma-pluriannuel-accessibilite")
              }
            >
              Schéma pluriannuel d’accessibilité
            </Link>
          </Box>
        </HStack>
      </Stack>
    </VStack>
  );
};
