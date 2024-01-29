"use client";

import {
  Box,
  HStack,
  Img,
  Link,
  Stack,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import NextLink from "next/link";

import { themeDefinition } from "../../../theme/theme";

interface LinkWithIconProps {
  children: React.ReactNode;
  href: string;
}

function LinkWithIcon({ children, href }: LinkWithIconProps) {
  return (
    <Link as={NextLink} href={href}>
      <HStack as="span" spacing="2px" display="inline-flex">
        {children}
        <Icon icon="ri:external-link-line" />
      </HStack>
    </Link>
  );
}

export default function LandingFooter() {
  return (
    <VStack
      borderTop="1px"
      borderTopColor={themeDefinition.colors.bluefrance[113]}
    >
      <Stack
        borderBottom="1px"
        borderBottomColor={themeDefinition.colors.grey[900]}
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
          <Img src="/logo_gouvernement_large.svg" />
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
            <Link
              as={NextLink}
              href="https://beta.gouv.fr/incubateurs/mission-inserjeunes"
              textDecoration="underline"
            >
              Mission interministérielle InserJeunes
            </Link>{" "}
            développe plusieurs services destinés à faciliter l’orientation et
            l’insertion des jeunes de la voie professionnelle
          </Text>
          <HStack
            justifyContent="start"
            width="100%"
            spacing="8px 24px"
            fontWeight={700}
            fontSize="14px"
            wrap="wrap"
          >
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
          color={themeDefinition.colors.grey[425]}
          gap={{
            base: "8px 8px",
            md: "16px",
          }}
          divider={
            <StackDivider borderColor={themeDefinition.colors.grey[900]} />
          }
          wrap="wrap"
        >
          <Box>
            <Link as={NextLink} href="/cgu">
              Mentions légales
            </Link>
          </Box>
          <Box>
            <Link as={NextLink} href="/changelog">
              Journal des mises à jour
            </Link>
          </Box>
        </HStack>
        <Box width="100%">
          <Text color={themeDefinition.colors.grey[425]} fontSize="12px">
            Sauf mention explicite de propriété intellectuelle détenue par des
            tiers, les contenus de ce site sont proposés sous{" "}
            <LinkWithIcon href="https://github.com/etalab/licence-ouverte/blob/master/LO.md">
              <Text as="span" textDecoration="underline">
                licence etalab-2.0
              </Text>
            </LinkWithIcon>
          </Text>
        </Box>
      </Stack>
    </VStack>
  );
}
