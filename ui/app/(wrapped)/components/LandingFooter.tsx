"use client";

import { Box, Flex, HStack, Img, Link, Stack, StackDivider, Text, VStack } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";
import { usePlausible } from "next-plausible";

interface LinkWithIconProps {
  children: React.ReactNode;
  href: string;
}

const LinkWithIcon = ({ children, href }: LinkWithIconProps) => {
  return (
    <Link as={NextLink} href={href} display="inline-flex" textDecoration="underline">
      {children}
      <Flex my={"auto"} ms={1}><Icon icon="ri:external-link-line" /></Flex>
    </Link>
  );
};

export const LandingFooter = () => {
  const trackEvent = usePlausible();

  return (
    <VStack mt={"auto"} borderTop="1px" borderTopColor={"grey.900"}>
      <Stack
        borderBottom="1px"
        borderBottomColor={"grey.900"}
        justifyContent="space-between"
        padding={{
          base: "16px",
          md: "20px 120px 20px 100px",
        }}
        width="100%"
        direction={{
          base: "column",
          md: "row",
        }}
      >
        <Box>
          <Img src="/logo_gouvernement_large.svg" alt="Logo république Française 2" />
        </Box>
        <VStack
          width={{
            base: "100%",
            md: "50%",
          }}
        >
          <Text
            padding={{
              base: "16px 0",
            }}
          >
            Mandatée par plusieurs ministères, la{" "}
            <Link as={NextLink} href="https://beta.gouv.fr/incubateurs/mission-inserjeunes" textDecoration="underline">
              Mission interministérielle InserJeunes
            </Link>{" "}
            développe plusieurs services destinés à faciliter l’orientation et l’insertion des jeunes de la voie
            professionnelle
          </Text>
          <HStack justifyContent="start" width="100%" spacing="8px 24px" fontWeight={700} fontSize="14px" wrap="wrap">
            <LinkWithIcon href="https://gouvernement.fr">
              <Text as="span">gouvernement.fr</Text>
            </LinkWithIcon>
            <LinkWithIcon href="https://service-public.fr">
              <Text as="span">service-public.fr</Text>
            </LinkWithIcon>
            <LinkWithIcon href="https://data.gouv.fr">
              <Text as="span">data.gouv.fr</Text>
            </LinkWithIcon>
          </HStack>
        </VStack>
      </Stack>
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
        <Flex justifyContent={"center"} width="100%">
          <Text color={"grey.425"} fontSize="12px">
            Sauf mention explicite de propriété intellectuelle détenue par des tiers, les contenus de ce site sont
            proposés sous{" "}
            <LinkWithIcon href="https://github.com/etalab/licence-ouverte/blob/master/LO.md">
              licence etalab-2.0
            </LinkWithIcon>
          </Text>
        </Flex>
      </Stack>
    </VStack>
  );
};
